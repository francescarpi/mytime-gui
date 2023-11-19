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
fn save_settings(integration: &str, url: &str, token: &str) {
    let db = DbManager::new();
    let sm = SettingsManager::new(&db.connection);
    sm.save(integration, url, token);
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
