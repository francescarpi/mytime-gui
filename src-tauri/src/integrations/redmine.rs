use crate::core::settings_manager::Settings;

use super::{Error, Integration};
use oxhttp::model::{Method, Request, Status};
use oxhttp::Client;

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
        settings: &Settings,
        desc: &str,
        date: &str,
        duration: &str,
        external_id: &str,
    ) -> Result<(), Error> {
        let url = format!("{}time_entries.json", settings.integration_url);
        let body = serde_json::json!({
            "time_entry": {
                "issue_id": external_id,
                "hours": duration,
                "comments": desc,
                "spent_on": date,
            }
        });

        let client = Client::new();
        let response = client
            .request(Self::prepare_request(
                &url,
                &body.to_string(),
                &settings.integration_token,
            ))
            .unwrap();

        if response.status() == Status::CREATED {
            return Ok(());
        }
        Err(Error::CheckExternalIdError)
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
