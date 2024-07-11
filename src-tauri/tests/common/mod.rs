use app::models::models::{Integration, NewIntegration};
use app::models::types::integration_type::IntegrationType;
use app::models::types::json_field::JsonField;
use app::repositories::IntegrationsRepository;
use diesel::{Connection, SqliteConnection};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use serde_json::json;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

pub fn get_db_connection() -> SqliteConnection {
    let db_url = ":memory:";
    let mut conn = SqliteConnection::establish(db_url).expect("Error connecting to test database");
    conn.run_pending_migrations(MIGRATIONS)
        .expect("Error running migrations");
    conn
}

pub fn add_integration(c: &mut SqliteConnection) -> Integration {
    let integration1 = NewIntegration {
        itype: IntegrationType::Redmine,
        active: false,
        name: None,
        config: JsonField(json!({"url": "https://redmine.org", "token": "123"})),
    };
    IntegrationsRepository::add_integration(c, &integration1);
    let integrations = IntegrationsRepository::integrations(c).unwrap();
    assert_eq!(integrations.len(), 1);
    integrations[0].clone()
}
