use crate::models::integration::IntegrationType;
use crate::models::{GroupedTask, Setting};
use redmine::Redmine;
use std::fmt;

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
    fn send_task(&self, settings: &Setting, task: &GroupedTask) -> Result<(), Error>;
}

pub fn get_integration(settings: &Setting) -> Option<impl Integration> {
    match settings.integration {
        Some(IntegrationType::Redmine) => Some(Redmine::new()),
        _ => None,
    }
}
