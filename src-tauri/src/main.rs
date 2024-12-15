// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod db;
pub mod integrations;
pub mod schema;
pub mod settings;
pub mod tasks;
pub mod tests;
pub mod utils;

use env_logger;
use std::env;
use std::sync::Mutex;

use tauri::tray::TrayIconBuilder;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .manage(db::DbConn(Mutex::new(
            db::establish_connection().expect("Error connecting to database"),
        )))
        .setup(|app| {
            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;
            env_logger::init();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            tasks::commands::tasks,
            tasks::commands::create_task,
            tasks::commands::stop_task,
            tasks::commands::summary,
            tasks::commands::edit_task,
            tasks::commands::group_tasks,
            tasks::commands::delete_task,
            tasks::commands::search,
            tasks::commands::dates_with_tasks,
            tasks::commands::toggle_favourite,
            tasks::commands::favourites,
            tasks::commands::last_task,
            settings::commands::settings,
            settings::commands::save_settings,
            settings::commands::info,
            settings::commands::show_in_folder,
            integrations::redmine::activities,
            integrations::redmine::project_activities,
            integrations::commands::send_to_integration,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
