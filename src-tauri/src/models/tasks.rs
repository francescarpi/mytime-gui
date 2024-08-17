use crate::schema::*;
use chrono::{NaiveDate, NaiveDateTime};
use diesel::deserialize::Queryable;
use diesel::deserialize::QueryableByName;
use diesel::sql_types::{Date, Integer, Nullable, Text};
use serde::{Deserialize, Serialize};

use super::ids;

#[derive(Deserialize, Debug, Queryable, QueryableByName, Serialize)]
#[diesel(table_name=tasks)]
pub struct Task {
    pub id: i32,
    pub desc: String,
    pub start: NaiveDateTime,
    pub end: Option<NaiveDateTime>,
    pub reported: bool,
    pub external_id: Option<String>,
    pub project: Option<String>,
    pub favourite: bool,
}

#[derive(Deserialize, Debug, Queryable, QueryableByName, Serialize)]
#[diesel(table_name=tasks)]
pub struct TaskWithDuration {
    pub id: i32,
    pub desc: String,
    pub start: NaiveDateTime,
    pub end: Option<NaiveDateTime>,
    pub reported: bool,
    pub external_id: Option<String>,
    pub project: Option<String>,
    pub favourite: bool,
    #[diesel(sql_type = Integer)]
    pub duration: i32,
}

#[derive(Deserialize, Debug, Queryable, QueryableByName)]
#[diesel(table_name=tasks)]
pub struct Duration {
    #[diesel(sql_type = Integer)]
    pub duration: i32,
}

#[derive(Serialize, Debug, Queryable, QueryableByName, Deserialize)]
#[diesel()]
pub struct GroupedTask {
    #[diesel(sql_type = Text)]
    pub id: String,
    #[diesel(sql_type = Text)]
    pub external_id: String,
    #[diesel(sql_type = Integer)]
    pub duration: i32,
    #[diesel(sql_type = Text)]
    pub desc: String,
    #[diesel(sql_type = Date)]
    pub date: NaiveDate,
    #[diesel(sql_type = Text)]
    pub ids: ids::ListIds,
    #[diesel(sql_type = Nullable<Text>)]
    pub project: Option<String>,
}

#[derive(Deserialize, Queryable, QueryableByName, Debug, Serialize)]
#[diesel()]
pub struct DatesWithTasks {
    #[diesel(sql_type = Date)]
    pub date: NaiveDate,
}
