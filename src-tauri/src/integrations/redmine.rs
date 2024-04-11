use super::{Error, Integration};
use crate::models::{GroupedTask, Setting};
use crate::utils::dates::format_duration;
use oxhttp::model::{Method, Request, Status};
use oxhttp::Client;
use serde::Deserialize;
use serde_json;
use url::Url;

#[derive(Debug, Deserialize)]
pub struct RedmineError {
    pub errors: Vec<String>,
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
        let mut url = Url::parse(settings.integration_url.as_ref().unwrap()).unwrap();
        if !url.path().ends_with('/') {
            url.path_segments_mut().unwrap().push("");
        }
        url.path_segments_mut().unwrap().push("time_entries.json");

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
        match client.request(Self::prepare_request(
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

    fn prepare_request(url: &str, body: &str, token: &str) -> Request {
        let mut request =
            Request::builder(Method::POST, url.parse().unwrap()).with_body(body.to_string());
        request
            .append_header("Content-Type", "application/json")
            .unwrap();
        request.append_header("X-Redmine-API-Key", token).unwrap();
        request
    }
}
