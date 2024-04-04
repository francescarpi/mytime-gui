// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod db;
pub mod integrations;
pub mod models;
pub mod repositories;
pub mod schema;
pub mod utils;

use models::Setting;
use tauri::{command, SystemTray};

use chrono::NaiveTime;
use integrations::*;
use repositories::{SettingsRepository, TasksRepository};
use serde::Serialize;
use serde_json::{json, Value};

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
fn tasks(date: &str) -> Result<Value, Value> {
    let mut db = db::establish_connection();
    let date = chrono::NaiveDate::parse_from_str(date, "%Y-%m-%d").unwrap();
    TasksRepository::tasks_with_duration_by_date(&mut db, date)
        .map(|tasks| json!(tasks))
        .map_err(|_| json!([]))
}

#[command]
fn summary(date: &str) -> Value {
    let mut db = db::establish_connection();
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

    json!(Summary {
        worked_week,
        worked_today,
        worked_month,
        goal_today,
        goal_week,
        is_running,
        pending_sync_tasks: unreported_tasks.len(),
    })
}

#[command]
fn create_task(desc: String, external_id: Option<String>, project: Option<String>) {
    let mut db = db::establish_connection();
    if let Some(task_id) = TasksRepository::get_current_working_task_id(&mut db) {
        let _task = TasksRepository::stop(&mut db, task_id);
    }

    let _task = TasksRepository::add_task(&mut db, desc, external_id, project);
}

#[command]
fn stop_task(id: i32) {
    let mut db = db::establish_connection();
    let _task = TasksRepository::stop(&mut db, id);
}

#[command]
fn edit_task(
    id: i32,
    project: Option<String>,
    desc: String,
    external_id: Option<String>,
    start: String,
    end: Option<String>,
) {
    let mut db = db::establish_connection();
    let new_start = NaiveTime::parse_from_str(&start, "%H:%M").unwrap();
    let new_end = end.map(|end| NaiveTime::parse_from_str(&end, "%H:%M").unwrap());

    let _task =
        TasksRepository::edit(&mut db, id, desc, new_start, new_end, external_id, project).unwrap();
}

#[command]
fn settings() -> Value {
    let mut db = db::establish_connection();
    json!(SettingsRepository::get_settings(&mut db).unwrap())
}

#[command]
fn save_settings(settings: Setting) {
    let mut db = db::establish_connection();
    let _settings = SettingsRepository::update(&mut db, &settings).unwrap();
}

#[command]
fn group_tasks() -> Value {
    let mut db = db::establish_connection();
    let tasks = TasksRepository::grouped_tasks(&mut db).unwrap();
    json!(tasks)
}

#[command]
async fn send_to_integration(
    description: String,
    date: String,
    duration: String,
    external_id: String,
    ids: String,
) -> Result<(), String> {
    let mut db = db::establish_connection();
    let settings = SettingsRepository::get_settings(&mut db).unwrap();

    match get_integration(&settings) {
        Some(integration) => {
            match integration.send_task(&settings, description, date, duration, external_id) {
                Ok(_) => {
                    let _ = TasksRepository::mark_tasks_as_reported(&mut db, ids);
                    Ok(())
                }
                Err(err) => Err(err.to_string()),
            }
        }
        None => Err(integrations::Error::IntegrationDoesNotExistError.to_string()),
    }
}

#[command]
fn delete_task(id: i32) {
    let mut db = db::establish_connection();
    let _task = TasksRepository::delete_task(&mut db, id);
}

#[command]
async fn search(query: &str, limit: Option<i32>) -> Result<Value, Value> {
    let mut db = db::establish_connection();
    let tasks = TasksRepository::search_tasks_with_duration(&mut db, query, limit).unwrap();
    Ok(json!(tasks))
}

#[command]
fn dates_with_tasks(month: u32, year: i32) -> Value {
    let mut db = db::establish_connection();
    let tasks = TasksRepository::dates_with_tasks(&mut db, month, year).unwrap();
    json!(tasks)
}

fn main() {
    let system_tray = SystemTray::new();
    tauri::Builder::default()
        .setup(|_app| {
            db::init();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            tasks,
            create_task,
            stop_task,
            summary,
            edit_task,
            settings,
            save_settings,
            group_tasks,
            send_to_integration,
            delete_task,
            search,
            dates_with_tasks,
        ])
        .system_tray(system_tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
