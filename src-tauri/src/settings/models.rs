use crate::{integrations::get_integration, schema::*};
use chrono::{Datelike, NaiveDate};
use diesel::{deserialize::Queryable, query_builder::AsChangeset};
use serde::{ser::SerializeStruct, Deserialize, Serialize, Serializer};

use super::types::{
    integration_type::IntegrationType, json_field::JsonField, view_type::ViewType,
    work_hours::WorkHours,
};

// Setting is a struct that represents the settings for the app.
#[derive(Deserialize, Debug, Queryable, AsChangeset)]
#[diesel(table_name=settings, treat_none_as_null=true)]
pub struct Setting {
    pub id: i32,
    pub integration: Option<IntegrationType>,
    pub work_hours: WorkHours,
    pub theme: String,
    pub view_type: ViewType,
    pub dark_mode: bool,
    pub right_sidebar_open: bool,
    pub theme_secondary: String,
    pub integration_config: JsonField,
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

    pub fn integration_valid(&self) -> bool {
        if self.integration.is_none() {
            return false;
        }

        let integration = get_integration(self);
        if integration.is_none() {
            return false;
        }

        integration.unwrap().is_valid(self)
    }
}

impl Serialize for Setting {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("Setting", 10)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("integration", &self.integration)?;
        state.serialize_field("work_hours", &self.work_hours)?;
        state.serialize_field("theme", &self.theme)?;
        state.serialize_field("view_type", &self.view_type)?;
        state.serialize_field("dark_mode", &self.dark_mode)?;
        state.serialize_field("right_sidebar_open", &self.right_sidebar_open)?;
        state.serialize_field("theme_secondary", &self.theme_secondary)?;
        state.serialize_field("integration_config", &self.integration_config)?;
        state.serialize_field("integration_valid", &self.integration_valid())?;
        state.end()
    }
}
