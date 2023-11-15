use platform_dirs::AppDirs;
use rusqlite::Connection;
use std::{env, fs};

#[derive(Debug)]
pub struct Db {
    pub connection: Connection,
    pub is_new: bool,
}

impl Db {
    pub fn new() -> Self {
        let is_new;
        match fs::metadata(Db::db_path()) {
            Ok(_) => is_new = false,
            Err(_) => is_new = true,
        }
        let connection = Connection::open(Db::db_path()).unwrap();
        Self { connection, is_new }
    }

    pub fn init(&self) {
        if self.is_new {
            self.create_tables()
        }
    }

    fn db_path() -> String {
        let app_dirs = AppDirs::new(Some("mytime"), true).unwrap();
        app_dirs.data_dir.join("mytime.db").to_str().unwrap().to_string()
    }

    pub fn create_tables(&self) {
        // tasks
        self.connection
            .execute(
                "CREATE TABLE tasks (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                desc        TEXT NOT NULL,
                start       INTEGER NOT NULL,
                end         INTEGER DEFAULT NULL,
                reported    INTEGER NOT NULL DEFAULT 0,
                external_id TEXT DEFAULT NULL,
                project     TEXT NOT NULL
            )",
                (),
            )
            .unwrap();

        // app
        const VERSION: &str = env!("CARGO_PKG_VERSION");
        self.connection
            .execute("CREATE TABLE app (version TEXT NOT NULL)", ())
            .unwrap();
        self.connection
            .execute("INSERT INTO app VALUES (?)", [VERSION])
            .unwrap();

        // settings
        self.connection
            .execute(
                "CREATE TABLE settings (
                integration         TEXT DEFAULT NULL,
                integration_url     TEXT DEFAULT NULL,
                integration_token   TEXT DEFAULT NULL
                )",
                (),
            )
            .unwrap();
        self.connection
            .execute(
                "INSERT INTO settings VALUES (?, ?, ?)",
                ["".to_string(), "".to_string(), "".to_string()],
            )
            .unwrap();
    }
}
