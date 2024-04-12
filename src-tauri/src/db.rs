use diesel::{Connection, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use platform_dirs::AppDirs;
use std::{fs, path::Path};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn establish_connection() -> SqliteConnection {
    let db_url = format!("sqlite://{}", db_path());

    SqliteConnection::establish(&db_url).expect("Error connecting to database")
}

fn db_dir() -> AppDirs {
    AppDirs::new(Some("mytime"), true).unwrap()
}

pub fn db_path() -> String {
    let app_dirs = db_dir();
    app_dirs
        .data_dir
        .join("mytime.sqlite")
        .to_str()
        .unwrap()
        .to_string()
}

fn db_exists() -> bool {
    let db_path = db_path();
    Path::new(&db_path).exists()
}

fn create_db_file() {
    fs::create_dir_all(db_dir().data_dir).unwrap();
    fs::File::create(db_path()).unwrap();
}

fn run_migrations() {
    let mut c = establish_connection();
    c.run_pending_migrations(MIGRATIONS).unwrap();
}

pub fn init() {
    if !db_exists() {
        create_db_file();
    }
    run_migrations();
}
