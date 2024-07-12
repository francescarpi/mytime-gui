use crate::models::models::{GroupedTask, Integration, IntegrationLog};
use crate::models::types::integration_type::IntegrationType;
use jira::Jira;
use redmine::Redmine;
use serde_json::Value;
use std::fmt;
use url::Url;

pub mod jira;
pub mod redmine;

// Engine errors
#[derive(Debug)]
pub enum Error {
    EngineDoesNotExistError,
    UnauthorizedError,
    UnkownHostError,
    GenericError(Vec<String>),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::EngineDoesNotExistError => write!(f, "Engine type does not exist"),
            Error::UnauthorizedError => write!(f, "Unauthorized"),
            Error::UnkownHostError => write!(f, "Unkown host"),
            Error::GenericError(e) => write!(f, "{:?}", e.join(", ")),
        }
    }
}

pub trait Engine {
    fn send_task(
        &self,
        config: &Value,
        integration_log: &IntegrationLog,
        task: &GroupedTask,
    ) -> Result<(), Error>;

    fn prepare_url(&self, config: &Value, suffix: Vec<&String>) -> String {
        let mut url = Url::parse(&config["url"].as_str().unwrap()).unwrap();
        if !url.path().ends_with('/') {
            url.path_segments_mut().unwrap().push("");
        }
        for s in suffix.iter() {
            url.path_segments_mut().unwrap().push(s);
        }
        url.as_str().to_string()
    }
}

pub fn get_engine(integration: &Integration) -> Option<Box<dyn Engine>> {
    match integration.itype {
        IntegrationType::Redmine => Some(Box::new(Redmine::new())),
        IntegrationType::Jira => Some(Box::new(Jira::new())),
    }
}
