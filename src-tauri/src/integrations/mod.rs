use std::fmt;
use crate::core::settings_manager::Settings;
use redmine::Redmine;

pub mod redmine;

// Integrations enum //////////////////////////////////////////////////////////
#[derive(Debug)]
pub enum IntegrationType {
    Redmine,
}

// Error struct ///////////////////////////////////////////////////////////////
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

// Traits /////////////////////////////////////////////////////////////////////
pub trait Integration {
    fn send_task(&self, settings: &Settings, desc: &str, date: &str, duration: &str, external_id: &str) -> Result<(), Error>;
}

// Functions //////////////////////////////////////////////////////////////////
pub fn get_integration(settings: &Settings) -> Option<impl Integration> {
    match settings.integration.as_str() {
        "redmine" => Some(Redmine::new()),
        &_ => None,
    }
}
