use diesel::SqliteConnection;
use std::sync::Mutex;

pub mod integrations;
pub mod settings;
pub mod tasks;

#[derive()]
pub struct DbConn(pub Mutex<SqliteConnection>);
