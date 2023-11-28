use rusqlite::{params, Connection};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Settings {
    pub integration: String,
    pub integration_url: String,
    pub integration_token: String,
    pub work_hours: Vec<u32>,
    pub theme: String,
    pub view_type: String,
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

        stmt.query_row([], |row| {
            let work_days: String = row.get(3)?;
            let work_days_list: Vec<u32> = work_days
                .split(',')
                .map(|col| col.parse::<u32>().unwrap())
                .collect();

            Ok(Settings {
                integration: row.get(0)?,
                integration_url: row.get(1)?,
                integration_token: row.get(2)?,
                theme: row.get(4)?,
                view_type: row.get(5)?,
                work_hours: work_days_list,
            })
        })
        .unwrap()
    }

    pub fn save(
        &self,
        integration: &str,
        url: &str,
        token: &str,
        work_hours: Vec<u32>,
        theme: &str,
    ) {
        let works_hours_strings: Vec<String> = work_hours
            .iter()
            .map(|weekday| weekday.to_string())
            .collect();

        self.connection
            .execute(
                "UPDATE settings SET 
                    integration = ?,
                    integration_url = ?, 
                    integration_token = ?,
                    work_hours = ?,
                    theme = ?;
                ",
                params![
                    integration,
                    url,
                    token,
                    works_hours_strings.join(","),
                    theme
                ],
            )
            .unwrap();
    }

    pub fn save_view_type(&self, view_type: &str) {
        self.connection
            .execute("UPDATE settings SET view_type = ?", params![view_type])
            .unwrap();
    }
}
