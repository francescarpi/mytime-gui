// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod core;
pub mod integrations;
pub mod utils;

use serde_json;
use tauri::command;

use core::db_manager::DbManager;
use core::integration_manager::IntegrationManager;
use core::settings_manager::SettingsManager;
use core::task_manager::{Summary, TasksManager};

#[command]
fn init(version: &str) {
    let db = DbManager::new();
    db.init(version);
    db.migrate(version);
}

#[command]
fn tasks(date: &str) -> String {
    let db = DbManager::new();
    let tm = TasksManager::new(&db.connection);
    serde_json::to_string(&tm.tasks(date)).unwrap()
}

#[command]
fn summary(date: &str) -> String {
    let db = DbManager::new();
    let tm = TasksManager::new(&db.connection);
    let im = IntegrationManager::new(&db.connection);
    serde_json::to_string(&Summary {
        this_week: tm.worked_week(&date),
        today: tm.worked_day(&date),
        is_running: tm.is_running(),
        pending_sync_tasks: im.group_tasks().len(),
    })
    .unwrap()
}

#[command]
fn create_task(project: &str, description: &str, external_id: &str) {
    let db = DbManager::new();
    let tm = TasksManager::new(&db.connection);
    tm.create_task(&project, &description, &external_id);
}

#[command]
fn stop_task(id: u64) {
    let db = DbManager::new();
    let tm = TasksManager::new(&db.connection);
    tm.stop_task(id);
}

#[command]
fn edit_task(id: u64, project: &str, desc: &str, external_id: &str, start: &str, end: &str) {
    let db = DbManager::new();
    let tm = TasksManager::new(&db.connection);
    tm.edit_task(id, project, desc, external_id, start, end);
}

#[command]
fn settings() -> String {
    let db = DbManager::new();
    let sm = SettingsManager::new(&db.connection);
    serde_json::to_string(&sm.settings()).unwrap()
}

#[command]
fn save_settings(
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
    theme: &str,
) {
    let db = DbManager::new();
    let sm = SettingsManager::new(&db.connection);
    sm.save(
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
        theme,
    );
}

#[command]
fn group_tasks() -> String {
    let db = DbManager::new();
    let im = IntegrationManager::new(&db.connection);
    serde_json::to_string(&im.group_tasks()).unwrap()
}

#[command]
fn send_to_integration(
    description: &str,
    date: &str,
    duration: &str,
    external_id: &str,
    ids: &str,
) -> Result<(), String> {
    let db = DbManager::new();
    let im = IntegrationManager::new(&db.connection);
    match im.send(description, date, duration, external_id, ids) {
        Ok(_) => Ok(()),
        Err(err) => Err(err.to_string()),
    }
}

#[command]
fn delete_task(id: u64) {
    let db = DbManager::new();
    TasksManager::new(&db.connection).delete_task(id);
}

#[command]
fn save_view_type(view_type: &str) {
    let db = DbManager::new();
    let sm = SettingsManager::new(&db.connection);
    sm.save_view_type(view_type);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            init,
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
            save_view_type,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
