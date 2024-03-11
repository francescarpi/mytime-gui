use crate::core::db_migrations::{INITIAL_MIGRATION, MIGRATIONS};
use platform_dirs::AppDirs;
use rusqlite::Connection;
use std::fs;
use version_compare::Version;

#[derive(Debug)]
pub struct DbManager {
    pub connection: Connection,
    pub is_new: bool,
}

impl Default for DbManager {
    fn default() -> Self {
        Self::new()
    }
}

impl DbManager {
    pub fn new() -> Self {
        let is_new = fs::metadata(DbManager::db_path()).is_err();
        let connection = Connection::open(DbManager::db_path()).unwrap();
        Self { connection, is_new }
    }

    pub fn init(&self, version: &str) {
        if self.is_new {
            self.initial_migration();
            self.update_version(version);
        } else {
            self.migrate(version);
        }
    }

    fn db_version(&self) -> String {
        let mut stmt = self
            .connection
            .prepare("SELECT version FROM app LIMIT 1")
            .unwrap();
        stmt.query_row([], |row| row.get(0)).unwrap()
    }

    pub fn migrate(&self, app_version: &str) {
        let db_version = self.db_version();
        let db_version = Version::from(&db_version).unwrap();
        let app_version = Version::from(app_version).unwrap();

        if app_version != db_version {
            for migration in MIGRATIONS {
                let migration_version = Version::from(migration.version).unwrap();
                if migration_version > db_version {
                    for query in migration.queries {
                        self.connection.execute(query, ()).unwrap();
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

    pub fn initial_migration(&self) {
        for sql in INITIAL_MIGRATION {
            self.connection.execute(sql, []).unwrap();
        }
    }

    fn update_version(&self, version: &str) {
        self.connection
            .execute("UPDATE app SET version = ?", [version])
            .unwrap();
    }
}
