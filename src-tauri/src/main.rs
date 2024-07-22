// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod api;
pub mod db;
pub mod engines;
pub mod models;
pub mod repositories;
pub mod schema;
pub mod utils;

use env_logger;
use std::env;
use std::sync::Mutex;

use tauri::tray::TrayIconBuilder;

use api::DbConn;
use engines::redmine;

fn main() {
    tauri::Builder::default()
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
            api::tasks::tasks,
            api::tasks::create_task,
            api::tasks::stop_task,
            api::tasks::summary,
            api::tasks::edit_task,
            api::tasks::group_tasks,
            api::tasks::delete_task,
            api::tasks::search,
            api::tasks::dates_with_tasks,
            api::tasks::toggle_favourite,
            api::tasks::last_task,
            api::tasks::favourites,
            api::settings::settings,
            api::settings::save_settings,
            api::settings::info,
            api::settings::show_in_folder,
            api::integrations::integrations,
            api::integrations::add_integration,
            api::integrations::update_integration,
            api::integrations::delete_integration,
            api::integrations::integration_log,
            api::integrations::send_to_integration,
            redmine::activities,
            // integrations::redmine::project_activities,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
