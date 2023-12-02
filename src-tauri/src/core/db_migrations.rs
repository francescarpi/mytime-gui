#[derive(Debug)]
pub struct Migration {
    pub version: &'static str,
    pub queries: &'static [&'static str],
}

pub const INITIAL_MIGRATION: [&'static str; 5] = [
    "CREATE TABLE tasks (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        desc                TEXT NOT NULL,
        start               INTEGER NOT NULL,
        end                 INTEGER DEFAULT NULL,
        reported            INTEGER NOT NULL DEFAULT 0,
        external_id         TEXT DEFAULT NULL,
        project             TEXT NOT NULL
    )",
    "CREATE TABLE app (version TEXT DEFAULT NULL)",
    "INSERT INTO app VALUES (NULL)",
    "CREATE TABLE settings (
        integration         TEXT NOT NULL DEFAULT '',
        integration_url     TEXT NOT NULL DEFAULT '',
        integration_token   TEXT NOT NULL DEFAULT '',
        work_hours          TEXT NOT NULL DEFAULT '8,8,8,8,8,0,0',
        theme               TEXT NOT NULL DEFAULT '#1976d2',
        view_type           TEXT NOT NULL DEFAULT 'chronological',
        dark_mode           INTEGER NOT NULL DEFAULT 0,
        tour_completed      INTEGER NOT NULL DEFAULT 0
    )",
    "INSERT INTO settings VALUES ('', '', '', '8,8,8,8,8,0,0', '#1976d2', 'chronological', 0, 0)",
];

pub const MIGRATIONS: &[Migration] = &[Migration {
    version: "0.0.18",
    queries: &["ALTER TABLE settings ADD tour_completed INTEGER NOT NULL DEFAULT 0"],
}];
