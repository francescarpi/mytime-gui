use crate::models::integration::IntegrationType;
use crate::models::{GroupedTask, Setting};
use redmine::Redmine;
use std::fmt;

pub mod redmine;

// Integration errors
#[derive(Debug)]
pub enum Error {
    IntegrationDoesNotExistError,
    CheckExternalIdError,
    UnauthorizedError,
    UnkownHostError,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::IntegrationDoesNotExistError => write!(f, "Integration type does not exist"),
            Error::CheckExternalIdError => write!(f, "Invalid external ID"),
            Error::UnauthorizedError => write!(f, "Unauthorized"),
            Error::UnkownHostError => write!(f, "Unkown host"),
        }
    }
}

// Integration trait
pub trait Integration {
    fn send_task(&self, settings: &Setting, task: &GroupedTask) -> Result<(), Error>;
}

pub fn get_integration(settings: &Setting) -> Option<impl Integration> {
    match settings.integration {
        Some(IntegrationType::Redmine) => Some(Redmine::new()),
        _ => None,
    }
}
