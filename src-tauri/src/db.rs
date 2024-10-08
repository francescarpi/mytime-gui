use diesel::{Connection, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use platform_dirs::AppDirs;
use std::sync::Mutex;
use std::{fs, path::Path};

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

#[derive()]
pub struct DbConn(pub Mutex<SqliteConnection>);

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

fn create_db_file() -> Result<(), std::io::Error> {
    fs::create_dir_all(db_dir().data_dir)?;
    fs::File::create(db_path())?;
    Ok(())
}

pub fn init() -> Result<(), std::io::Error> {
    if !db_exists() {
        create_db_file()?;
    }
    Ok(())
}

pub fn establish_connection() -> Option<SqliteConnection> {
    let resp = init();
    if resp.is_err() {
        return None;
    }

    let db_url = format!("sqlite://{}", db_path());
    let mut conn = SqliteConnection::establish(&db_url).expect("Error connecting to database");
    conn.run_pending_migrations(MIGRATIONS).unwrap();
    Some(conn)
}
