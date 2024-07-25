use super::{Engine, Error};
use crate::api::DbConn;
use crate::models::models::{GroupedTask, IntegrationLog};
use crate::repositories::integrations::IntegrationsRepository;
use crate::utils::dates::format_duration;
use oxhttp::model::{Method, Request, Status};
use oxhttp::Client;
use serde::{Deserialize, Serialize};
use serde_json::{self, Value};
use tauri::{command, State};

#[derive(Debug, Deserialize)]
pub struct RedmineError {
    pub errors: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RedmineTimeActivity {
    pub id: i32,
    pub name: String,
    pub is_default: bool,
    pub active: bool,
}

#[derive(Debug, Deserialize)]
pub struct RedmineTimeActivities {
    pub time_entry_activities: Vec<RedmineTimeActivity>,
}

#[derive(Debug, Deserialize)]
pub struct RedmineIssueProject {
    pub id: i32,
}

#[derive(Debug, Deserialize)]
pub struct RedmineIssue {
    pub id: i32,
    pub project: RedmineIssueProject,
}

#[derive(Debug, Deserialize)]
pub struct RedmineIssueResponse {
    pub issue: RedmineIssue,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RedmineProjectActivity {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct RedmineProject {
    pub id: i32,
    pub time_entry_activities: Vec<RedmineProjectActivity>,
}

#[derive(Debug, Deserialize)]
pub struct RedmineProjectResponse {
    pub project: RedmineProject,
}

#[derive(Debug, Serialize)]
pub enum RedmineErrorType {
    IssueNotFound,
    GenericError,
}

#[derive(Debug)]
pub struct Redmine {}

impl Default for Redmine {
    fn default() -> Self {
        Self::new()
    }
}

impl Engine for Redmine {
    fn send_task(
        &self,
        config: &Value,
        integration_log: &IntegrationLog,
        task: &GroupedTask,
    ) -> Result<(), Error> {
        let url = self.prepare_url(config, vec![&"time_entries.json".to_string()]);
        let token = config["token"].as_str().unwrap();
        let body = serde_json::json!({
            "time_entry": {
                "issue_id": integration_log.external_id,
                "hours": format_duration(task.duration),
                "comments": task.desc,
                "spent_on": task.date.to_string(),
                "activity_id": config["activity"].as_str().unwrap(),
            }
        });

        let client = Client::new();
        match client.request(Self::build_post_request(
            url.as_ref(),
            &body.to_string(),
            token.to_string(),
        )) {
            Ok(response) => {
                if response.status() == Status::CREATED {
                    return Ok(());
                }
                if response.status() == Status::UNAUTHORIZED {
                    return Err(Error::UnauthorizedError);
                }
                let response_body = response.into_body().to_string().unwrap();
                let error = serde_json::from_str::<RedmineError>(&response_body).unwrap();
                Err(Error::GenericError(error.errors))
            }
            Err(_) => Err(Error::UnkownHostError),
        }
    }
}

impl Redmine {
    pub fn new() -> Self {
        Self {}
    }

    fn build_post_request(url: &str, body: &str, token: String) -> Request {
        Request::builder(Method::POST, url.parse().unwrap())
            .with_header("Content-Type", "application/json")
            .unwrap()
            .with_header("X-Redmine-API-Key", token)
            .unwrap()
            .with_body(body.to_string())
    }

    fn build_get_request(url: &str, token: String) -> Request {
        Request::builder(Method::GET, url.parse().unwrap())
            .with_header("Content-Type", "application/json")
            .unwrap()
            .with_header("X-Redmine-API-Key", token)
            .unwrap()
            .build()
    }

    pub fn activities(&self, config: Value) -> Vec<RedmineTimeActivity> {
        let url = self.prepare_url(
            &config,
            vec![
                &"enumerations".to_string(),
                &"time_entry_activities.json".to_string(),
            ],
        );
        log::info!("redmine url: {}", url);
        let token = config["token"].as_str().unwrap();
        let client = Client::new();
        match client.request(Self::build_get_request(url.as_ref(), token.to_string())) {
            Ok(response) => {
                if response.status() == Status::OK {
                    let response_body = response.into_body().to_string().unwrap();

                    let activities =
                        serde_json::from_str::<RedmineTimeActivities>(&response_body).unwrap();

                    return activities.time_entry_activities;
                }
                vec![]
            }
            Err(_) => vec![],
        }
    }

    pub fn project_activities(
        &self,
        config: Value,
        external_id: &String,
    ) -> Result<Vec<RedmineProjectActivity>, RedmineErrorType> {
        let client = Client::new();
        let token = config["token"].as_str().unwrap();

        // Get issue
        let url = self.prepare_url(
            &config,
            vec![&"issues".to_string(), &format!("{}.json", external_id)],
        );

        let response = client.request(Self::build_get_request(url.as_ref(), token.to_string()));
        if response.is_err() {
            return Err(RedmineErrorType::GenericError);
        }

        let unwrapped_response = response.unwrap();

        if unwrapped_response.status() == Status::NOT_FOUND
            || unwrapped_response.status() == Status::FORBIDDEN
        {
            return Err(RedmineErrorType::IssueNotFound);
        }

        let issue_response = serde_json::from_str::<RedmineIssueResponse>(
            &unwrapped_response.into_body().to_string().unwrap(),
        )
        .unwrap();

        // Get project
        let url = self.prepare_url(
            &config,
            vec![
                &"projects".to_string(),
                &format!("{}.json", issue_response.issue.project.id),
            ],
        );
        let url = format!("{}?include=time_entry_activities", url);
        let response = client.request(Self::build_get_request(url.as_ref(), token.to_string()));

        if response.is_err() {
            return Err(RedmineErrorType::GenericError);
        }

        let project_response = serde_json::from_str::<RedmineProjectResponse>(
            &response.unwrap().into_body().to_string().unwrap(),
        )
        .unwrap();

        Ok(project_response.project.time_entry_activities)
    }
}

#[command]
pub async fn activities(
    conn: State<'_, DbConn>,
    integration_id: i32,
) -> Result<serde_json::Value, serde_json::Value> {
    let mut db = conn.0.lock().unwrap();
    let integration = IntegrationsRepository::integration(&mut db, integration_id).unwrap();
    Ok(serde_json::json!(
        Redmine::new().activities(integration.config.0)
    ))
}

#[command]
pub async fn project_activities(
    conn: State<'_, DbConn>,
    external_id: String,
    integration_id: i32,
) -> Result<serde_json::Value, serde_json::Value> {
    let mut db = conn.0.lock().unwrap();
    let integration = IntegrationsRepository::integration(&mut db, integration_id).unwrap();

    Ok(serde_json::json!(
        Redmine::new().project_activities(integration.config.0, &external_id)
    ))
}
