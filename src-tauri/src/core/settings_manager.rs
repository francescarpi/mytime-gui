use rusqlite::{params, Connection};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Settings {
    pub integration: String,
    pub integration_url: String,
    pub integration_token: String,
    pub work_hours: Vec<f32>,
    pub theme: String,
    pub view_type: String,
    pub dark_mode: bool,
    pub tour_completed: bool,
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
            let work_days_list: Vec<f32> = work_days
                .split(',')
                .map(|col| col.parse::<f32>().unwrap())
                .collect();

            Ok(Settings {
                integration: row.get(0)?,
                integration_url: row.get(1)?,
                integration_token: row.get(2)?,
                theme: row.get(4)?,
                view_type: row.get(5)?,
                work_hours: work_days_list,
                dark_mode: row.get(6)?,
                tour_completed: row.get(7)?,
            })
        })
        .unwrap()
    }

    pub fn save(
        &self,
        integration: &str,
        url: &str,
        token: &str,
        work_hours: Vec<f32>,
        theme: &str,
        tour_completed: bool,
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
                    theme = ?,
                    tour_completed = ?;
                ",
                params![
                    integration,
                    url,
                    token,
                    works_hours_strings.join(","),
                    theme,
                    tour_completed,
                ],
            )
            .unwrap();
    }

    pub fn save_view_type(&self, view_type: &str) {
        self.connection
            .execute("UPDATE settings SET view_type = ?", params![view_type])
            .unwrap();
    }

    pub fn save_dark_mode(&self, dark_mode: bool) {
        self.connection
            .execute("UPDATE settings SET dark_mode = ?", params![dark_mode])
            .unwrap();
    }

    pub fn save_tour_completed(&self, completed: bool) {
        self.connection
            .execute("UPDATE settings SET tour_completed = ?", params![completed])
            .unwrap();
    }
}
