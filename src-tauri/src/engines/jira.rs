use super::Engine;
use super::Error;
use crate::models::models::{GroupedTask, IntegrationLog};
use base64::{engine::general_purpose::STANDARD, Engine as _};
use oxhttp::model::{Method, Request};
use serde::Deserialize;
use serde_json::Value;

#[derive(Debug, Deserialize)]
pub struct JiraJorklogResponse {
    #[serde(rename = "errorMessages")]
    pub error_message: Vec<String>,
}

#[derive(Debug)]
pub struct Jira {}

impl Default for Jira {
    fn default() -> Self {
        Self::new()
    }
}

impl Engine for Jira {
    fn send_task(
        &self,
        _config: &Value,
        _integration_log: &IntegrationLog,
        _task: &GroupedTask,
    ) -> Result<(), Error> {
        // let url = self.prepare_url(
        //     settings,
        //     vec![
        //         &"rest".to_string(),
        //         &"api".to_string(),
        //         &"latest".to_string(),
        //         &"issue".to_string(),
        //         &"TODO".to_string(),
        //         &"worklog".to_string(),
        //     ],
        // );
        // let token = &settings.integration_token.as_ref().unwrap();
        // let username = &settings.integration_username.as_ref().unwrap();
        // let body = serde_json::json!({
        //         "timeSpentSeconds": task.duration,
        // });
        //
        // let client = Client::new();
        // match client.request(Self::build_request(
        //     url.as_ref(),
        //     &body.to_string(),
        //     username,
        //     token,
        // )) {
        //     Ok(response) => {
        //         if response.status() == Status::NOT_FOUND {
        //             let response_body = response.into_body().to_string().unwrap();
        //             let response =
        //                 serde_json::from_str::<JiraJorklogResponse>(&response_body).unwrap();
        //             return Err(Error::GenericError(response.error_message));
        //         }
        //
        //         if response.status() == Status::CREATED {
        //             return Ok(());
        //         }
        //
        //         Err(Error::GenericError(vec!["Unexpected error".to_string()]))
        //     }
        //     Err(_) => Err(Error::UnkownHostError),
        // }
        // TODO: check
        Ok(())
    }
}

impl Jira {
    pub fn new() -> Self {
        Self {}
    }

    fn build_request(url: &str, body: &str, username: &str, token: &str) -> Request {
        let user_token = format!("{}:{}", username, token);
        let b64_user_token = STANDARD.encode(user_token);
        let mut request =
            Request::builder(Method::POST, url.parse().unwrap()).with_body(body.to_string());
        request
            .append_header("Content-Type", "application/json")
            .unwrap();
        request
            .append_header("Authorization", format!("Basic {}", b64_user_token))
            .unwrap();
        request
    }
}
