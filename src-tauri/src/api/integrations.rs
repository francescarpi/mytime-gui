use crate::engines::get_engine;
use crate::engines::Error;
use crate::models::models::{Integration, NewIntegration, NewIntegrationLog};
use crate::repositories::integrations::IntegrationsRepository;
use crate::repositories::tasks::TasksRepository;
use serde_json::{json, Value};
use std::env;
use tauri::{command, State};

use super::DbConn;

#[command]
pub fn integrations(conn: State<'_, DbConn>) -> Value {
    let mut db = conn.0.lock().unwrap();
    let integrations = IntegrationsRepository::integrations(&mut db).unwrap();
    json!(integrations)
}

#[command]
pub fn add_integration(conn: State<'_, DbConn>, integration: NewIntegration) {
    let mut db = conn.0.lock().unwrap();
    IntegrationsRepository::add_integration(&mut db, &integration);
}

#[command]
pub fn update_integration(conn: State<'_, DbConn>, integration: Integration) {
    let mut db = conn.0.lock().unwrap();
    IntegrationsRepository::update_integration(&mut db, &integration);
}

#[command]
pub fn delete_integration(conn: State<'_, DbConn>, id: i32) {
    let mut db = conn.0.lock().unwrap();
    IntegrationsRepository::delete_integration(&mut db, id);
}

#[command]
pub fn integration_log(conn: State<'_, DbConn>, task_id: String, integration_id: i32) -> Value {
    let mut db = conn.0.lock().unwrap();
    match IntegrationsRepository::get_integration_log(&mut db, &task_id, integration_id) {
        Ok(log) => json!(log),
        Err(_) => json!(null),
    }
}

#[command]
pub async fn send_to_integration(
    task_id: String,
    integration_id: i32,
    external_id: String,
    conn: State<'_, DbConn>,
) -> Result<(), String> {
    let mut db = conn.0.lock().unwrap();
    let integration_log = IntegrationsRepository::get_or_create_integration_log(
        &mut db,
        &NewIntegrationLog {
            task_id: task_id.clone(),
            integration_id,
            external_id,
        },
    );
    let integration = IntegrationsRepository::integration(&mut db, integration_id).unwrap();
    let skip_send = env::var("SKIP_SEND").unwrap_or_default() == "true";
    let tasks = TasksRepository::grouped_tasks(&mut db).unwrap();
    let task = tasks.iter().find(|task| task.id == task_id).unwrap();

    log::info!("sending task: {:?}", task.id);

    if let Some(engine) = get_engine(&integration) {
        if skip_send {
            let _ = TasksRepository::mark_tasks_as_reported(&mut db, &task.ids.0);
            Ok(())
        } else {
            match engine.send_task(&integration.config.0, &integration_log, task) {
                Ok(_) => {
                    // let _ = TasksRepository::mark_tasks_as_reported(&mut db, &task.ids.0);
                    Ok(())
                }
                Err(err) => {
                    // TODO: update log
                    Err(err.to_string())
                }
            }
        }
    } else {
        Err(Error::EngineDoesNotExistError.to_string())
    }
}
