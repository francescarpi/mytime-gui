use crate::schema::settings;
use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

use super::models::Setting;

pub struct SettingsRepository;

impl SettingsRepository {
    pub fn get_settings(c: &mut SqliteConnection) -> QueryResult<Setting> {
        settings::table.first::<Setting>(c)
    }

    pub fn update(c: &mut SqliteConnection, setting: &Setting) -> QueryResult<Setting> {
        diesel::update(settings::table.find(setting.id))
            .set(setting)
            .execute(c)
            .expect("Error updating settings");
        Self::get_settings(c)
    }
}
