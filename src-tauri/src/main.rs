// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod db;
pub mod integrations;
pub mod models;
pub mod repositories;
pub mod schema;
pub mod utils;

use std::process::Command;

use models::Setting;
use tauri::{command, SystemTray};

use chrono::NaiveTime;
use integrations::*;
use repositories::{SettingsRepository, TasksRepository};
use serde::Serialize;
use serde_json::{json, Value};

#[cfg(target_os = "linux")]
use std::{fs::metadata, path::PathBuf};

#[cfg(target_os = "linux")]
use fork::{daemon, Fork};

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
async fn send_to_integration(id: String, extra_param: Option<String>) -> Result<(), String> {
    let mut db = db::establish_connection();
    let settings = SettingsRepository::get_settings(&mut db).unwrap();

    if let Some(integration) = get_integration(&settings) {
        let tasks = TasksRepository::grouped_tasks(&mut db).unwrap();
        let task = tasks.iter().find(|task| task.id == id).unwrap();
        match integration.send_task(&settings, task, extra_param) {
            Ok(_) => {
                let _ = TasksRepository::mark_tasks_as_reported(&mut db, &task.ids.0);
                Ok(())
            }
            Err(err) => Err(err.to_string()),
        }
    } else {
        Err(integrations::Error::IntegrationDoesNotExistError.to_string())
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

#[command]
fn toggle_favourite(task_id: i32) {
    let mut db = db::establish_connection();
    let _task_id = TasksRepository::toggle_favourite(&mut db, task_id);
}

#[command]
fn favourites() -> Value {
    let mut db = db::establish_connection();
    let tasks = TasksRepository::favourites(&mut db).unwrap();
    json!(tasks)
}

#[command]
fn redmine_activities() -> Value {
    let mut db = db::establish_connection();
    let settings = SettingsRepository::get_settings(&mut db).unwrap();
    json!(integrations::redmine::Redmine::activities(&settings))
}

#[command]
async fn redmine_project_activities(external_id: String) -> Value {
    let mut db = db::establish_connection();
    let settings = SettingsRepository::get_settings(&mut db).unwrap();
    json!(integrations::redmine::Redmine::project_activities(
        &settings,
        external_id
    ))
}

#[command]
fn info(app_handle: tauri::AppHandle) -> Value {
    let package_info = app_handle.package_info();
    let mut db = db::establish_connection();

    json!({
        "version": package_info.version,
        "authors": package_info.authors,
        "db_path": db::db_path(),
        "total_tasks": TasksRepository::total_tasks(&mut db).unwrap(),
    })
}

#[tauri::command]
fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path]) // The comma after select is not a typo
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        if path.contains(",") {
            // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
            let new_path = match metadata(&path).unwrap().is_dir() {
                true => path,
                false => {
                    let mut path2 = PathBuf::from(path);
                    path2.pop();
                    path2.into_os_string().into_string().unwrap()
                }
            };
            Command::new("xdg-open").arg(&new_path).spawn().unwrap();
        } else {
            if let Ok(Fork::Child) = daemon(false, false) {
                Command::new("dbus-send")
                    .args([
                        "--session",
                        "--dest=org.freedesktop.FileManager1",
                        "--type=method_call",
                        "/org/freedesktop/FileManager1",
                        "org.freedesktop.FileManager1.ShowItems",
                        format!("array:string:\"file://{path}\"").as_str(),
                        "string:\"\"",
                    ])
                    .spawn()
                    .unwrap();
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open").args(["-R", &path]).spawn().unwrap();
    }
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
            toggle_favourite,
            favourites,
            redmine_activities,
            redmine_project_activities,
            info,
            show_in_folder,
        ])
        .system_tray(system_tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
