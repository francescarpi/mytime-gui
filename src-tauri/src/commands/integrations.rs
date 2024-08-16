use std::env;
use tauri::{command, State};

use crate::{
    get_integration, integrations,
    repositories::{settings::SettingsRepository, tasks::TasksRepository},
};

use super::DbConn;

#[command]
pub async fn send_to_integration(
    id: String,
    extra_param: Option<String>,
    conn: State<'_, DbConn>,
) -> Result<(), String> {
    let mut db = conn.0.lock().unwrap();
    let settings = SettingsRepository::get_settings(&mut db).unwrap();
    let skip_send = env::var("SKIP_SEND").unwrap_or_default() == "true";

    if let Some(integration) = get_integration(&settings) {
        let tasks = TasksRepository::grouped_tasks(&mut db).unwrap();
        let task = tasks.iter().find(|task| task.id == id).unwrap();

        log::info!("sending task: {:?}", task.id);

        if skip_send {
            let _ = TasksRepository::mark_tasks_as_reported(&mut db, &task.ids.0);
            Ok(())
        } else {
            match integration.send_task(&settings, task, extra_param) {
                Ok(_) => {
                    let _ = TasksRepository::mark_tasks_as_reported(&mut db, &task.ids.0);
                    Ok(())
                }
                Err(err) => Err(err.to_string()),
            }
        }
    } else {
        Err(integrations::Error::IntegrationDoesNotExistError.to_string())
    }
}
