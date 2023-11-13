use rusqlite::{params, Connection};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Settings {
    pub integration: String,
    pub integration_url: String,
    pub integration_token: String,
}

#[derive(Debug, Clone)]
pub struct SettingsManager<'a> {
    pub connection: &'a Connection,
}

impl<'a> SettingsManager<'a> {
    pub fn new(connection: &'a Connection) -> Self {
        Self { connection }
    }

    pub fn settings(&self) -> Settings {
        let mut stmt = self
            .connection
            .prepare("SELECT * FROM settings LIMIT 1")
            .unwrap();

        match stmt.query_row([], |row| {
            Ok(Settings {
                integration: row.get(0)?,
                integration_url: row.get(1)?,
                integration_token: row.get(2)?,
            })
        }) {
            Ok(resp) => resp,
            Err(_) => Settings {
                integration: "".to_string(),
                integration_url: "".to_string(),
                integration_token: "".to_string(),
            },
        }
    }

    pub fn save(&self, integration: &str, url: &str, token: &str) {
        self.connection
            .execute(
                "UPDATE settings SET integration = ?, integration_url = ?, 
                    integration_token = ?",
                params![integration, url, token],
            )
            .unwrap();
    }
}
