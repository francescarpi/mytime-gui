use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Task {
    pub id: i64,
    pub desc: String,
    pub start: String,
    pub end: Option<String>,
    pub reported: bool,
    pub external_id: Option<String>,
    pub project: String,
    pub duration: u64,
}

#[derive(Debug, Clone, Serialize)]
pub struct Summary {
    pub this_week: u64,
    pub today: u64,
    pub is_running: bool,
}
