use platform_dirs::AppDirs;
use rusqlite::Connection;
use std::fs;
use version_compare::Version;
use crate::core::db_migrations::MIGRATIONS;

#[derive(Debug)]
pub struct DbManager {
    pub connection: Connection,
    pub is_new: bool,
}

impl DbManager {
    pub fn new() -> Self {
        let is_new;
        match fs::metadata(DbManager::db_path()) {
            Ok(_) => is_new = false,
            Err(_) => is_new = true,
        }
        let connection = Connection::open(DbManager::db_path()).unwrap();
        Self { connection, is_new }
    }

    pub fn init(&self, version: &str) {
        if self.is_new {
            self.create_tables();
            self.update_version(version);
        }
    }

    fn db_version(&self) -> String {
        let mut stmt = self
            .connection
            .prepare("SELECT version FROM app LIMIT 1")
            .unwrap();
        stmt.query_row([], |row| Ok(row.get(0)?)).unwrap()
    }

    pub fn migrate(&self, app_version: &str) {
        let db_version = self.db_version();
        let db_version = Version::from(&db_version).unwrap();
        let app_version = Version::from(app_version).unwrap();


        if app_version != db_version {
            for migration in MIGRATIONS {
                let migration_version = Version::from(&migration.version).unwrap();
                if migration_version > db_version {
                    for query in migration.queries {
                        self.connection.execute(&query, ()).unwrap();
                    }
                }
            }

            self.update_version(&app_version.to_string());
        }
    }

    fn db_path() -> String {
        let app_dirs = AppDirs::new(Some("mytime"), true).unwrap();
        fs::create_dir_all(&app_dirs.data_dir).unwrap();
        app_dirs
            .data_dir
            .join("mytime.db")
            .to_str()
            .unwrap()
            .to_string()
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
        self.connection
            .execute("CREATE TABLE app (version TEXT DEFAULT NULL)", ())
            .unwrap();
        self.connection
            .execute("INSERT INTO app VALUES (NULL)", [])
            .unwrap();

        // settings
        self.connection
            .execute(
                "CREATE TABLE settings (
                    integration             TEXT DEFAULT NULL,
                    integration_url         TEXT DEFAULT NULL,
                    integration_token       TEXT DEFAULT NULL,
                    work_hours              TEXT NOT NULL DEFAULT '8,8,8,8,8,0,0',
                    theme                   TEXT NOT NULL DEFAULT '#1976d2',
                    view_type               TEXT NOT NULL DEFAULT 'chronological'
                )",
                (),
            )
            .unwrap();
        self.connection
            .execute(
                "INSERT INTO settings VALUES (?, ?, ?, ?, ?, ?)",
                [
                    "".to_string(),
                    "".to_string(),
                    "".to_string(),
                    "8,8,8,8,8,0,0".to_string(),
                    "#1976d2".to_string(),
                    "chronological".to_string(),
                ],
            )
            .unwrap();
    }

    fn update_version(&self, version: &str) {
        self.connection
            .execute("UPDATE app SET version = ?", [version])
            .unwrap();
    }
}
