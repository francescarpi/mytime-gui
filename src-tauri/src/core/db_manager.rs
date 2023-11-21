use platform_dirs::AppDirs;
use rusqlite::Connection;
use std::fs;
use version_compare::Version;

#[derive(Debug)]
struct Migration {
    version: String,
    queries: Vec<String>,
}

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

        let migrations: Vec<Migration> = vec![
            Migration {
                version: "0.0.9".to_string(),
                queries: vec![
                    "ALTER TABLE settings ADD working_hours_monday INTEGER NOT NULL DEFAULT 8;"
                        .to_string(),
                    "ALTER TABLE settings ADD working_hours_tuesday INTEGER NOT NULL DEFAULT 8;"
                        .to_string(),
                    "ALTER TABLE settings ADD working_hours_wednesday INTEGER NOT NULL DEFAULT 8;"
                        .to_string(),
                    "ALTER TABLE settings ADD working_hours_thursday INTEGER NOT NULL DEFAULT 8;"
                        .to_string(),
                    "ALTER TABLE settings ADD working_hours_friday INTEGER NOT NULL DEFAULT 8;"
                        .to_string(),
                    "ALTER TABLE settings ADD working_hours_saturday INTEGER NOT NULL DEFAULT 0;"
                        .to_string(),
                    "ALTER TABLE settings ADD working_hours_sunday INTEGER NOT NULL DEFAULT 0;"
                        .to_string(),
                ],
            },
            Migration {
                version: "0.0.10".to_string(),
                queries: vec!["ALTER TABLE settings ADD theme TEXT NOT NULL DEFAULT '#1976d2';".to_string()],
            },
        ];

        if app_version != db_version {
            for migration in migrations {
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

    fn update_version(&self, version: &str) {
        self.connection
            .execute("UPDATE app SET version = ?", [version])
            .unwrap();
    }
}
