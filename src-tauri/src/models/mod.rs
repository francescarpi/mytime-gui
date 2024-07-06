use std::str::FromStr;

use crate::schema::*;
use chrono::{Datelike, NaiveDate, NaiveDateTime};
use diesel::deserialize::{FromSqlRow, QueryableByName};
use diesel::expression::AsExpression;
use diesel::prelude::Insertable;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::{Date, Integer, Text};
use diesel::sqlite::Sqlite;
use diesel::{deserialize::Queryable, query_builder::AsChangeset};
use serde::{Deserialize, Serialize};

pub mod ids;
// pub mod integration;
pub mod utils;
pub mod view_type;
pub mod work_hours;

// Setting is a struct that represents the settings for the app.
#[derive(Deserialize, Debug, Queryable, AsChangeset, Serialize)]
#[diesel(table_name=settings, treat_none_as_null=true)]
pub struct Setting {
    pub id: i32,
    pub work_hours: work_hours::WorkHours,
    pub theme: String,
    pub view_type: view_type::ViewType,
    pub dark_mode: bool,
    pub tour_completed: bool,
    pub right_sidebar_open: bool,
    pub theme_secondary: String,
}

impl Setting {
    pub fn goal_by_date(&self, date: NaiveDate) -> f32 {
        let wd = date.weekday();
        let hours = match wd {
            chrono::Weekday::Mon => self.work_hours.monday,
            chrono::Weekday::Tue => self.work_hours.tuesday,
            chrono::Weekday::Wed => self.work_hours.wednesday,
            chrono::Weekday::Thu => self.work_hours.thursday,
            chrono::Weekday::Fri => self.work_hours.friday,
            chrono::Weekday::Sat => self.work_hours.saturday,
            chrono::Weekday::Sun => self.work_hours.sunday,
        };
        hours * 3600.0
    }

    pub fn week_goal(&self) -> f32 {
        let mut total = 0.0;
        total += self.work_hours.monday;
        total += self.work_hours.tuesday;
        total += self.work_hours.wednesday;
        total += self.work_hours.thursday;
        total += self.work_hours.friday;
        total += self.work_hours.saturday;
        total += self.work_hours.sunday;
        total * 3600.0
    }

    pub fn has_integration(&self) -> bool {
        // self.integration.is_some()
        //     && self.integration_url.is_some()
        //     && self.integration_token.is_some()
        // TODO: check
        false
    }
}

#[derive(Deserialize, Debug, Queryable, QueryableByName, Serialize)]
#[diesel(table_name=tasks)]
pub struct Task {
    pub id: i32,
    pub desc: String,
    pub start: NaiveDateTime,
    pub end: Option<NaiveDateTime>,
    pub reported: bool,
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
    #[diesel(sql_type = Integer)]
    pub duration: i32,
    #[diesel(sql_type = Text)]
    pub desc: String,
    #[diesel(sql_type = Date)]
    pub date: NaiveDate,
    #[diesel(sql_type = Text)]
    pub ids: ids::ListIds,
}

#[derive(Deserialize, Queryable, QueryableByName, Debug, Serialize)]
#[diesel()]
pub struct DatesWithTasks {
    #[diesel(sql_type = Date)]
    pub date: NaiveDate,
}

#[derive(Debug, Insertable, Serialize, Deserialize, Queryable)]
#[diesel(table_name=integrations, treat_none_as_null=true)]
pub struct NewIntegration {
    pub itype: IntegrationType,
    pub active: bool,
    pub name: Option<String>,
    pub config: utils::JsonField,
}

// TODO: move this type (and all others) into a types file

#[derive(AsExpression, Debug, FromSqlRow, Serialize, Deserialize)]
#[diesel(sql_type=Text)]
pub enum IntegrationType {
    Redmine,
    Jira,
}

impl ToString for IntegrationType {
    fn to_string(&self) -> String {
        match self {
            IntegrationType::Redmine => String::from("redmine"),
            IntegrationType::Jira => String::from("jira"),
        }
    }
}

impl FromStr for IntegrationType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "redmine" => Ok(IntegrationType::Redmine),
            "jira" => Ok(IntegrationType::Jira),
            _ => Err(()),
        }
    }
}

impl ToSql<Text, Sqlite> for IntegrationType {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Sqlite>) -> serialize::Result {
        out.set_value(self.to_string());
        match self {
            IntegrationType::Redmine => out.set_value("redmine"),
            IntegrationType::Jira => out.set_value("jira"),
        };
        Ok(IsNull::No)
    }
}
