use serde_json::{json, Value};
use std::process::Command;
use tauri::{command, State};

use crate::{
    db::{self, DbConn},
    settings::repository::SettingsRepository,
    tasks::repository::TasksRepository,
};

#[cfg(target_os = "linux")]
use std::{fs::metadata, path::PathBuf};

#[cfg(target_os = "linux")]
use fork::{daemon, Fork};

use super::models::Setting;

#[command]
pub fn settings(conn: State<'_, DbConn>) -> Value {
    let mut db = conn.0.lock().unwrap();
    json!(SettingsRepository::get_settings(&mut db).unwrap())
}

#[command]
pub fn save_settings(settings: Setting, conn: State<'_, DbConn>) {
    let mut db = conn.0.lock().unwrap();
    let _settings = SettingsRepository::update(&mut db, &settings).unwrap();
}

#[command]
pub fn info(app_handle: tauri::AppHandle, conn: State<'_, DbConn>) -> Value {
    let package_info = app_handle.package_info();
    let mut db = conn.0.lock().unwrap();

    json!({
        "version": package_info.version.to_string(),
        "authors": package_info.authors,
        "db_path": db::db_path(),
        "total_tasks": TasksRepository::total_tasks(&mut db).unwrap(),
    })
}

#[tauri::command]
pub fn show_in_folder(path: String) {
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
