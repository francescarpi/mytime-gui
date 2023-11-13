use crate::core::settings_manager::SettingsManager;
use oxhttp::model::{Method, Request, Status};
use oxhttp::Client;
use rusqlite::Connection;
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct IntegrationTask {
    pub external_id: String,
    pub duration: u64,
    pub desc: String,
    pub date: String,
    pub ids: Vec<u64>,
}

#[derive(Debug, Clone)]
pub struct IntegrationManager<'a> {
    pub connection: &'a Connection,
}

impl<'a> IntegrationManager<'a> {
    pub fn new(connection: &'a Connection) -> Self {
        Self { connection }
    }

    pub fn group_tasks(&self) -> Vec<IntegrationTask> {
        let mut stmt = self
            .connection
            .prepare(
                "SELECT	
                    external_id,
                    SUM(COALESCE(strftime('%s', end), strftime('%s', 'now')) - strftime('%s', start)) AS duration,
                    desc,
                    strftime('%Y-%m-%d', start),
                    GROUP_CONCAT(id) AS ids
                FROM
                    tasks
                WHERE
                    end IS NOT NULL
                    AND reported = false
                    AND external_id IS NOT NULL
                    AND external_id != ''
                GROUP BY
                    external_id",
            )
            .unwrap();

        let rows = stmt
            .query_map([], |row| {
                let ids_str: String = row.get(4)?;
                let ids: Vec<u64> = ids_str
                    .split(',')
                    .map(|id| id.parse::<u64>().unwrap())
                    .collect();
                Ok(IntegrationTask {
                    external_id: row.get(0)?,
                    duration: row.get(1)?,
                    desc: row.get(2)?,
                    date: row.get(3)?,
                    ids,
                })
            })
            .unwrap();

        rows.map(|row| row.unwrap()).collect()
    }

    pub fn send(
        &self,
        desc: &str,
        date: &str,
        duration: &str,
        external_id: &str,
        ids: &str,
    ) -> bool {
        let sm = SettingsManager::new(&self.connection);
        let settings = sm.settings();
        let url = format!("{}time_entries.json", settings.integration_url);
        let body = serde_json::json!({
            "time_entry": {
                "issue_id": external_id,
                "hours": duration,
                "comments": desc,
                "spent_on": date,
            }
        });

        let client = Client::new();
        let response = client
            .request(Self::prepare_request(
                &url,
                &body.to_string(),
                &settings.integration_token,
            ))
            .unwrap();

        if response.status() == Status::CREATED {
            self.mark_tasks_as_reported(ids);
            return true;
        }
        false
    }

    fn prepare_request(url: &str, body: &str, token: &str) -> Request {
        let mut request =
            Request::builder(Method::POST, url.parse().unwrap()).with_body(body.to_string());
        request
            .append_header("Content-Type", "application/json")
            .unwrap();
        request.append_header("X-Redmine-API-Key", token).unwrap();
        request
    }

    fn mark_tasks_as_reported(&self, ids: &str) {
        let ids_list: Vec<u64> = ids
            .split(',')
            .map(|id| id.parse::<u64>().unwrap())
            .collect();

        let query = format!(
            "UPDATE tasks SET reported = true WHERE id IN ({})",
            ids_list
                .iter()
                .map(|&id| id.to_string())
                .collect::<Vec<String>>()
                .join(","),
        );

        self.connection.execute(&query, []).unwrap();
    }
}
