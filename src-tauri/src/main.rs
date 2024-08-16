// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod commands;
pub mod db;
pub mod integrations;
pub mod models;
pub mod repositories;
pub mod schema;
pub mod utils;

use commands::DbConn;
use env_logger;
use std::env;
use std::sync::Mutex;

use tauri::tray::TrayIconBuilder;

use integrations::*;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .manage(DbConn(Mutex::new(
            db::establish_connection().expect("Error connecting to database"),
        )))
        .setup(|app| {
            TrayIconBuilder::new().build(app)?;
            env_logger::init();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::tasks::tasks,
            commands::tasks::create_task,
            commands::tasks::stop_task,
            commands::tasks::summary,
            commands::tasks::edit_task,
            commands::settings::settings,
            commands::settings::save_settings,
            commands::tasks::group_tasks,
            commands::integrations::send_to_integration,
            commands::tasks::delete_task,
            commands::tasks::search,
            commands::tasks::dates_with_tasks,
            commands::tasks::toggle_favourite,
            commands::tasks::favourites,
            commands::settings::info,
            commands::settings::show_in_folder,
            commands::tasks::last_task,
            integrations::redmine::activities,
            integrations::redmine::project_activities,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
