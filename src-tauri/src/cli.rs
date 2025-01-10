use std::{collections::HashMap, hash::RandomState};

use serde_json::{json, Value};
use tauri::State;
use tauri_plugin_cli::ArgData;
use tokio;

use crate::db;
use crate::tasks;

pub fn parse_matches(
    args: HashMap<String, ArgData, RandomState>,
    state: State<'_, db::DbConn>,
) -> Value {
    if args["tasks"].value.is_string() {
        let date = args["tasks"].value.as_str().unwrap();
        return tasks::commands::tasks(&date, state).unwrap();
    }
    if args["summary"].value.is_string() {
        let date = args["summary"].value.as_str().unwrap();
        let rt = tokio::runtime::Runtime::new().unwrap();
        return rt.block_on(tasks::commands::summary(&date, state)).unwrap();
    }
    json!({})
}
