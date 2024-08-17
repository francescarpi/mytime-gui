use crate::schema::*;
use chrono::{Datelike, NaiveDate};
use diesel::{deserialize::Queryable, query_builder::AsChangeset};
use serde::{Deserialize, Serialize};

use super::types::{integration_type::IntegrationType, view_type::ViewType, work_hours::WorkHours};

// Setting is a struct that represents the settings for the app.
#[derive(Deserialize, Debug, Queryable, AsChangeset, Serialize)]
#[diesel(table_name=settings, treat_none_as_null=true)]
pub struct Setting {
    pub id: i32,
    pub integration: Option<IntegrationType>,
    pub integration_url: Option<String>,
    pub integration_token: Option<String>,
    pub work_hours: WorkHours,
    pub theme: String,
    pub view_type: ViewType,
    pub dark_mode: bool,
    pub tour_completed: bool,
    pub integration_extra_param: Option<String>,
    pub right_sidebar_open: bool,
    pub theme_secondary: String,
    pub integration_username: Option<String>,
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
        self.integration.is_some()
            && self.integration_url.is_some()
            && self.integration_token.is_some()
    }
}
