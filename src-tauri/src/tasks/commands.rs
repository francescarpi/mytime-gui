use chrono::NaiveTime;
use serde::Serialize;
use serde_json::{json, Value};
use tauri::{command, State};

use crate::{db::DbConn, settings::repository::SettingsRepository};

use super::repository::TasksRepository;

#[derive(Debug, Clone, Serialize)]
struct Summary {
    pub worked_today: i32,
    pub worked_week: i32,
    pub worked_month: i32,
    pub goal_today: f32,
    pub goal_week: f32,
    pub is_running: bool,
    pub pending_sync_tasks: usize,
}

#[command]
pub fn tasks(date: &str, conn: State<'_, DbConn>) -> Result<Value, Value> {
    let mut db = conn.0.lock().unwrap();
    let date = chrono::NaiveDate::parse_from_str(date, "%Y-%m-%d").unwrap();
    TasksRepository::tasks_with_duration_by_date(&mut db, date)
        .map(|tasks| json!(tasks))
        .map_err(|_| json!([]))
}

#[command]
pub async fn summary(date: &str, conn: State<'_, DbConn>) -> Result<Value, Value> {
    let mut db = conn.0.lock().unwrap();
    let date = chrono::NaiveDate::parse_from_str(date, "%Y-%m-%d").unwrap();

    let worked_week = TasksRepository::worked_during_the_week(&mut db, date)
        .map(|w| w.duration)
        .unwrap();
    let worked_today = TasksRepository::worked_during_the_day(&mut db, date)
        .map(|w| w.duration)
        .unwrap();
    let worked_month = TasksRepository::worked_during_the_month(&mut db, date)
        .map(|w| w.duration)
        .unwrap();
    let is_running = TasksRepository::are_tasks_running(&mut db);

    let settings = SettingsRepository::get_settings(&mut db).unwrap();
    let goal_today = settings.goal_by_date(date);
    let goal_week = settings.week_goal();

    let unreported_tasks = TasksRepository::grouped_tasks(&mut db).unwrap();

    Ok(json!(Summary {
        worked_week,
        worked_today,
        worked_month,
        goal_today,
        goal_week,
        is_running,
        pending_sync_tasks: unreported_tasks.len(),
    }))
}

#[command]
pub fn create_task(
    desc: String,
    external_id: Option<String>,
    project: Option<String>,
    conn: State<'_, DbConn>,
) {
    let mut db = conn.0.lock().unwrap();
    if let Some(task_id) = TasksRepository::get_current_working_task_id(&mut db) {
        let _task = TasksRepository::stop(&mut db, task_id);
    }

    let _task = TasksRepository::add_task(&mut db, desc, external_id, project);
}

#[command]
pub fn stop_task(id: i32, conn: State<'_, DbConn>) {
    let mut db = conn.0.lock().unwrap();
    let _task = TasksRepository::stop(&mut db, id);
}

#[command]
pub fn edit_task(
    id: i32,
    project: Option<String>,
    desc: String,
    external_id: Option<String>,
    start: String,
    end: Option<String>,
    conn: State<'_, DbConn>,
) {
    let mut db = conn.0.lock().unwrap();
    let new_start = NaiveTime::parse_from_str(&start, "%H:%M").unwrap();
    let new_end = end.map(|end| NaiveTime::parse_from_str(&end, "%H:%M").unwrap());

    let _task =
        TasksRepository::edit(&mut db, id, desc, new_start, new_end, external_id, project).unwrap();
}

#[command]
pub fn group_tasks(conn: State<'_, DbConn>) -> Value {
    let mut db = conn.0.lock().unwrap();
    let tasks = TasksRepository::grouped_tasks(&mut db).unwrap();
    json!(tasks)
}

#[command]
pub fn last_task(conn: State<'_, DbConn>) -> Value {
    let mut db = conn.0.lock().unwrap();
    let task = TasksRepository::last_task(&mut db);
    task.map(|task| json!(task)).unwrap_or(json!(null))
}

#[command]
pub fn delete_task(id: i32, conn: State<'_, DbConn>) {
    let mut db = conn.0.lock().unwrap();
    let _task = TasksRepository::delete_task(&mut db, id);
}

#[command]
pub async fn search(
    query: &str,
    limit: Option<i32>,
    conn: State<'_, DbConn>,
) -> Result<Value, Value> {
    let mut db = conn.0.lock().unwrap();
    let tasks = TasksRepository::search_tasks_with_duration(&mut db, query, limit).unwrap();
    Ok(json!(tasks))
}

#[command]
pub fn dates_with_tasks(month: u32, year: i32, conn: State<'_, DbConn>) -> Value {
    let mut db = conn.0.lock().unwrap();
    let tasks = TasksRepository::dates_with_tasks(&mut db, month, year).unwrap();
    json!(tasks)
}

#[command]
pub fn toggle_favourite(task_id: i32, conn: State<'_, DbConn>) {
    let mut db = conn.0.lock().unwrap();
    let _task_id = TasksRepository::toggle_favourite(&mut db, task_id);
}

#[command]
pub fn favourites(conn: State<'_, DbConn>) -> Value {
    let mut db = conn.0.lock().unwrap();
    let tasks = TasksRepository::favourites(&mut db).unwrap();
    json!(tasks)
}
