use diesel::{Connection, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn get_db_connection() -> SqliteConnection {
    let db_url = ":memory:";
    let mut conn = SqliteConnection::establish(db_url).expect("Error connecting to test database");
    conn.run_pending_migrations(MIGRATIONS)
        .expect("Error running migrations");
    conn
}
