use crate::models::{
    settings::Setting, tasks::GroupedTask, types::integration_type::IntegrationType,
};
use jira::Jira;
use redmine::Redmine;
use std::fmt;
use url::Url;

pub mod jira;
pub mod redmine;

// Integration errors
#[derive(Debug)]
pub enum Error {
    IntegrationDoesNotExistError,
    UnauthorizedError,
    UnkownHostError,
    GenericError(Vec<String>),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::IntegrationDoesNotExistError => write!(f, "Integration type does not exist"),
            Error::UnauthorizedError => write!(f, "Unauthorized"),
            Error::UnkownHostError => write!(f, "Unkown host"),
            Error::GenericError(e) => write!(f, "{:?}", e.join(", ")),
        }
    }
}

// Integration trait
pub trait Integration {
    fn send_task(
        &self,
        settings: &Setting,
        task: &GroupedTask,
        extra_param: Option<String>,
    ) -> Result<(), Error>;

    fn prepare_url(&self, settings: &Setting, suffix: Vec<&String>) -> String {
        let mut url = Url::parse(settings.integration_url.as_ref().unwrap()).unwrap();
        if !url.path().ends_with('/') {
            url.path_segments_mut().unwrap().push("");
        }
        for s in suffix.iter() {
            url.path_segments_mut().unwrap().push(s);
        }
        url.as_str().to_string()
    }
}

// Method that receive a settings struct and depends on the settings.integration
// returns an implementation of the Integration trait (Redmine or Jira)
pub fn get_integration(settings: &Setting) -> Option<Box<dyn Integration>> {
    match settings.integration {
        Some(IntegrationType::Redmine) => Some(Box::new(Redmine::new())),
        Some(IntegrationType::Jira) => Some(Box::new(Jira::new())),
        _ => None,
    }
}
