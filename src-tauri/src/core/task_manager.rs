use chrono::{Datelike, Local, NaiveDate, Utc};
use rusqlite::params;
use rusqlite::{Connection, Result, Row};

use super::task::Task;
use super::utils::dates::change_time;

#[derive(Debug, Clone)]
pub struct TasksManager<'a> {
    pub connection: &'a Connection,
}

impl<'a> TasksManager<'a> {
    pub fn new(connection: &'a Connection) -> Self {
        Self { connection }
    }

    pub fn stop_task(&self, id: u64) {
        let now = Utc::now().with_timezone(&Local).to_rfc3339();
        self.connection
            .execute("UPDATE tasks SET end = ? WHERE id = ?", params![now, id])
            .unwrap();
    }

    pub fn create_task(&self, project: &str, description: &str, external_id: &str) {
        let now = Utc::now().with_timezone(&Local).to_rfc3339();

        // Close open task
        self.connection
            .execute("UPDATE tasks SET end = ? WHERE end IS NULL", params![now])
            .unwrap();

        // Start new one
        self.connection
            .execute(
                "INSERT INTO tasks (project, desc, start, external_id) VALUES (?, ?, ?, ?)",
                params![project, description, now, external_id],
            )
            .unwrap();
    }

    pub fn tasks(&self, date: &str) -> Vec<Task> {
        let mut stmt = self
            .connection
            .prepare(
                "SELECT *, (COALESCE(strftime('%s', end), strftime('%s', 'now')) - strftime('%s', start)) AS duration 
                FROM tasks WHERE strftime('%Y-%m-%d', start) = ? ORDER BY start DESC, id",
            )
            .unwrap();

        let rows = stmt
            .query_map(params![date.to_string()], |row| self.row_to_task(row))
            .unwrap();
        rows.map(|row| row.unwrap()).collect()
    }

    pub fn worked_day(&self, date: &str) -> u64 {
        let mut today_statement = self
            .connection
            .prepare(
                "SELECT 
                    COALESCE(
                        SUM(
                            COALESCE(strftime('%s', end), strftime('%s', 'now')) - strftime('%s', start)
                        ),
                    0)
                FROM tasks WHERE strftime('%Y-%m-%d', start) = ?",
            )
            .unwrap();

        today_statement
            .query_row(params![date], |row| Ok(row.get(0)?))
            .unwrap()
    }

    pub fn worked_week(&self, date: &str) -> u64 {
        let naive_date = NaiveDate::parse_from_str(date, "%Y-%m-%d").unwrap();
        let week_number = naive_date.iso_week().week().to_string();
        let mut this_week_statement = self
            .connection
            .prepare(
                "SELECT COALESCE(
                    SUM(
                        COALESCE(strftime('%s', end), strftime('%s', 'now')) - strftime('%s', start)
                    ),
                0)
                FROM tasks WHERE strftime('%W', start) = ?",
            )
            .unwrap();

        this_week_statement
            .query_row(params![week_number], |row| Ok(row.get(0)?))
            .unwrap()
    }

    pub fn task(&self, id: u64) -> Task {
        let mut stmt = self
            .connection
            .prepare(
                "SELECT *, (COALESCE(strftime('%s', end), strftime('%s', 'now')) - strftime('%s', start)) AS duration 
                FROM tasks WHERE id = ?",
            )
            .unwrap();

        stmt.query_row(params![id], |row| Ok(self.row_to_task(row)))
            .unwrap()
            .unwrap()
    }

    pub fn is_running(&self) -> bool {
        let mut stmt = self.connection.prepare("SELECT count(*) FROM tasks WHERE end IS NULL").unwrap();
        stmt.query_row([], |row| Ok(row.get(0)?)).unwrap()
    }

    pub fn edit_task(
        &self,
        id: u64,
        project: &str,
        desc: &str,
        external_id: &str,
        start: &str,
        end: &str,
    ) {
        let task = self.task(id);
        let new_start = change_time(&task.start, &start);

        match task.end {
            Some(end_date) => {
                let new_end = change_time(&end_date, &end);
                self.connection.execute(
                    "UPDATE tasks SET project = ?, desc = ?, external_id = ?, start = ?, end = ? WHERE id = ?",
                    params![project, desc, external_id, new_start, new_end, id],
                ).unwrap();
            }
            None => {
                self.connection.execute(
                    "UPDATE tasks SET project = ?, desc = ?, external_id = ?, start = ? WHERE id = ?",
                    params![project, desc, external_id, new_start, id],
                ).unwrap();
            }
        };
    }

    fn row_to_task(&self, row: &Row) -> Result<Task> {
        Ok(Task {
            id: row.get(0)?,
            desc: row.get(1)?,
            start: row.get(2)?,
            end: row.get(3)?,
            reported: row.get(4)?,
            external_id: row.get(5)?,
            project: row.get(6)?,
            duration: row.get(7)?,
        })
    }
}
