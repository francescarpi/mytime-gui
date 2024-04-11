use super::{Error, Integration};
use crate::models::{GroupedTask, Setting};
use crate::utils::dates::format_duration;
use oxhttp::model::{Method, Request, Status};
use oxhttp::Client;
use serde::{Deserialize, Serialize};
use serde_json;

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

#[derive(Debug)]
pub struct Redmine {}

impl Default for Redmine {
    fn default() -> Self {
        Self::new()
    }
}

impl Integration for Redmine {
    fn send_task(&self, settings: &Setting, task: &GroupedTask) -> Result<(), Error> {
        let url = Self::prepare_url(settings, vec!["time_entries.json".to_string()]);
        let token = &settings.integration_token.as_ref().unwrap();
        let body = serde_json::json!({
            "time_entry": {
                "issue_id": task.external_id,
                "hours": format_duration(task.duration),
                "comments": task.desc,
                "spent_on": task.date.to_string()
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

                    return activities
                        .time_entry_activities
                        .into_iter()
                        .filter(|activity| activity.active)
                        .collect::<Vec<RedmineTimeActivity>>();
                }
                vec![]
            }
            Err(_) => vec![],
        }
    }
}
