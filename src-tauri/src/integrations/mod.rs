use crate::models::integration::IntegrationType;
use crate::models::Setting;
use redmine::Redmine;
use std::fmt;

pub mod redmine;

// Integration errors
#[derive(Debug)]
pub enum Error {
    IntegrationDoesNotExistError,
    CheckExternalIdError,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::IntegrationDoesNotExistError => write!(f, "Integration type does not exist"),
            Error::CheckExternalIdError => write!(f, "Check external ID"),
        }
    }
}

// Integration trait
pub trait Integration {
    fn send_task(
        &self,
        settings: &Setting,
        desc: String,
        date: String,
        duration: String,
        external_id: String,
    ) -> Result<(), Error>;
}

pub fn get_integration(settings: &Setting) -> Option<impl Integration> {
    match settings.integration {
        Some(IntegrationType::Redmine) => Some(Redmine::new()),
        _ => None,
    }
}
