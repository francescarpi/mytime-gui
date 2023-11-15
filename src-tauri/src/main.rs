// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod core;

use core::task::Summary;

use crate::core::db::Db;
use crate::core::integration_manager::IntegrationManager;
use crate::core::settings_manager::SettingsManager;
use crate::core::task_manager::TasksManager;
use serde_json;

#[tauri::command]
fn config_ready() {
    let db = Db::new();
    db.init();
}

#[tauri::command]
fn tasks(date: &str) -> String {
    let db = Db::new();
    let tm = TasksManager::new(&db.connection);
    serde_json::to_string(&tm.tasks(date)).unwrap()
}

#[tauri::command]
fn summary(date: &str) -> String {
    let db = Db::new();
    let tm = TasksManager::new(&db.connection);
    serde_json::to_string(&Summary {
        this_week: tm.worked_week(&date),
        today: tm.worked_day(&date),
        is_running: tm.is_running(),
    })
    .unwrap()
}

#[tauri::command]
fn create_task(project: &str, description: &str, external_id: &str) {
    let db = Db::new();
    let tm = TasksManager::new(&db.connection);
    tm.create_task(&project, &description, &external_id);
}

#[tauri::command]
fn stop_task(id: u64) {
    let db = Db::new();
    let tm = TasksManager::new(&db.connection);
    tm.stop_task(id);
}

#[tauri::command]
fn edit_task(id: u64, project: &str, desc: &str, external_id: &str, start: &str, end: &str) {
    let db = Db::new();
    let tm = TasksManager::new(&db.connection);
    tm.edit_task(id, project, desc, external_id, start, end);
}

#[tauri::command]
fn settings() -> String {
    let db = Db::new();
    let sm = SettingsManager::new(&db.connection);
    serde_json::to_string(&sm.settings()).unwrap()
}

#[tauri::command]
fn save_settings(integration: &str, url: &str, token: &str) {
    let db = Db::new();
    let sm = SettingsManager::new(&db.connection);
    sm.save(integration, url, token);
}

#[tauri::command]
fn group_tasks() -> String {
    let db = Db::new();
    let im = IntegrationManager::new(&db.connection);
    serde_json::to_string(&im.group_tasks()).unwrap()
}

#[tauri::command]
fn send_to_integration(
    description: &str,
    date: &str,
    duration: &str,
    external_id: &str,
    ids: &str,
) {
    let db = Db::new();
    let im = IntegrationManager::new(&db.connection);
    im.send(description, date, duration, external_id, ids);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            config_ready,
            tasks,
            create_task,
            stop_task,
            summary,
            edit_task,
            settings,
            save_settings,
            group_tasks,
            send_to_integration,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
