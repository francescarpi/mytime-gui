use super::{Error, Integration};
use crate::models::{GroupedTask, Setting};
use crate::repositories::SettingsRepository;
use crate::utils::dates::format_duration;
use crate::{db, integrations};
use oxhttp::model::{Method, Request, Status};
use oxhttp::Client;
use serde::{Deserialize, Serialize};
use serde_json;
use tauri::command;

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

#[derive(Debug)]
pub struct Redmine {}

impl Default for Redmine {
    fn default() -> Self {
        Self::new()
    }
}

impl Integration for Redmine {
    fn send_task(
        &self,
        settings: &Setting,
        task: &GroupedTask,
        extra_param: Option<String>,
    ) -> Result<(), Error> {
        let url = Self::prepare_url(settings, vec!["time_entries.json".to_string()]);
        let token = &settings.integration_token.as_ref().unwrap();
        let body = serde_json::json!({
            "time_entry": {
                "issue_id": task.external_id,
                "hours": format_duration(task.duration),
                "comments": task.desc,
                "spent_on": task.date.to_string(),
                "activity_id": extra_param,
            }
        });

        let client = Client::new();
        match client.request(Self::prepare_post_request(
            url.as_ref(),
            &body.to_string(),
            token,
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

    fn prepare_post_request(url: &str, body: &str, token: &str) -> Request {
        let mut request =
            Request::builder(Method::POST, url.parse().unwrap()).with_body(body.to_string());
        request
            .append_header("Content-Type", "application/json")
            .unwrap();
        request.append_header("X-Redmine-API-Key", token).unwrap();
        request
    }

    fn prepare_get_request(url: &str, token: &str) -> Request {
        let mut request = Request::builder(Method::GET, url.parse().unwrap()).build();
        request
            .append_header("Content-Type", "application/json")
            .unwrap();
        request.append_header("X-Redmine-API-Key", token).unwrap();
        request
    }

    pub fn activities(settings: &Setting) -> Vec<RedmineTimeActivity> {
        let url = Self::prepare_url(
            settings,
            vec![
                "enumerations".to_string(),
                "time_entry_activities.json".to_string(),
            ],
        );
        let token = &settings.integration_token.as_ref().unwrap();
        let client = Client::new();
        match client.request(Self::prepare_get_request(url.as_ref(), token)) {
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
        settings: &Setting,
        external_id: String,
    ) -> Vec<RedmineProjectActivity> {
        let client = Client::new();
        let token = &settings.integration_token.as_ref().unwrap();

        // Get issue
        let url = Self::prepare_url(
            settings,
            vec!["issues".to_string(), format!("{}.json", external_id)],
        );
        let response = client.request(Self::prepare_get_request(url.as_ref(), token));
        if response.is_err() {
            return vec![];
        }

        let issue_response = serde_json::from_str::<RedmineIssueResponse>(
            &response.unwrap().into_body().to_string().unwrap(),
        )
        .unwrap();

        // Get project
        let url = Self::prepare_url(
            settings,
            vec![
                "projects".to_string(),
                format!("{}.json", issue_response.issue.project.id),
            ],
        );
        let url = format!("{}?include=time_entry_activities", url);
        let response = client.request(Self::prepare_get_request(url.as_ref(), token));

        if response.is_err() {
            return vec![];
        }

        let project_response = serde_json::from_str::<RedmineProjectResponse>(
            &response.unwrap().into_body().to_string().unwrap(),
        )
        .unwrap();

        project_response.project.time_entry_activities
    }
}

#[command]
pub async fn activities() -> serde_json::Value {
    let mut db = db::establish_connection();
    let settings = SettingsRepository::get_settings(&mut db).unwrap();
    if settings.has_integration() {
        return serde_json::json!(integrations::redmine::Redmine::activities(&settings));
    }
    serde_json::json!([])
}

#[command]
pub async fn project_activities(external_id: String) -> serde_json::Value {
    let mut db = db::establish_connection();
    let settings = SettingsRepository::get_settings(&mut db).unwrap();
    if settings.has_integration() {
        return serde_json::json!(integrations::redmine::Redmine::project_activities(
            &settings,
            external_id
        ));
    }

    serde_json::json!([])
}
