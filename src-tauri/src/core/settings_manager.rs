use rusqlite::{params, Connection};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Settings {
    pub integration: String,
    pub integration_url: String,
    pub integration_token: String,
    pub work_hours_monday: u64,
    pub work_hours_tuesday: u64,
    pub work_hours_wednesday: u64,
    pub work_hours_thursday: u64,
    pub work_hours_friday: u64,
    pub work_hours_saturday: u64,
    pub work_hours_sunday: u64,
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
                work_hours_monday: row.get(3)?,
                work_hours_tuesday: row.get(4)?,
                work_hours_wednesday: row.get(5)?,
                work_hours_thursday: row.get(6)?,
                work_hours_friday: row.get(7)?,
                work_hours_saturday: row.get(8)?,
                work_hours_sunday: row.get(9)?,
            })
        }) {
            Ok(resp) => resp,
            Err(_) => Settings {
                integration: "".to_string(),
                integration_url: "".to_string(),
                integration_token: "".to_string(),
                work_hours_monday: 8,
                work_hours_tuesday: 8,
                work_hours_wednesday: 8,
                work_hours_thursday: 8,
                work_hours_friday: 8,
                work_hours_saturday: 0,
                work_hours_sunday: 0,
            },
        }
    }

    pub fn save(
        &self,
        integration: &str,
        url: &str,
        token: &str,
        work_hours_monday: u64,
        work_hours_tuesday: u64,
        work_hours_wednesday: u64,
        work_hours_thursday: u64,
        work_hours_friday: u64,
        work_hours_saturday: u64,
        work_hours_sunday: u64,
    ) {
        self.connection
            .execute(
                "UPDATE settings SET 
                    integration = ?,
                    integration_url = ?, 
                    integration_token = ?,
                    working_hours_monday = ?,
                    working_hours_tuesday = ?,
                    working_hours_wednesday = ?,
                    working_hours_thursday = ?,
                    working_hours_friday = ?,
                    working_hours_saturday = ?,
                    working_hours_sunday = ?;
                ",
                params![
                    integration,
                    url,
                    token,
                    work_hours_monday,
                    work_hours_tuesday,
                    work_hours_wednesday,
                    work_hours_thursday,
                    work_hours_friday,
                    work_hours_saturday,
                    work_hours_sunday,
                ],
            )
            .unwrap();
    }
}
