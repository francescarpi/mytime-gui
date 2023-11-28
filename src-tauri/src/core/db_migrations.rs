#[derive(Debug)]
pub struct Migration {
    pub version: String,
    pub queries: Vec<String>,
}

pub const MIGRATIONS: Vec<Migration> = vec![];
