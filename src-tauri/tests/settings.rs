extern crate app;

pub mod common;

#[cfg(test)]
mod tests {
    use app::{
        models::{
            models::NewIntegration,
            types::{
                integration_type::IntegrationType, json_field::JsonField, view_type::ViewType,
                work_hours::WorkHours,
            },
        },
        repositories::SettingsRepository,
    };
    use serde_json::json;

    use crate::common::get_db_connection;

    #[test]
    fn create_default_settings() {
        // Setup
        let mut c = get_db_connection();

        // Test
        let settings = SettingsRepository::get_settings(&mut c).unwrap();
        assert_eq!(settings.right_sidebar_open, false);

        assert_eq!(
            settings.work_hours.to_string(),
            "8.00,8.00,8.00,8.00,8.00,0.00,0.00"
        );
        assert_eq!(
            settings.work_hours,
            WorkHours {
                monday: 8.0,
                tuesday: 8.0,
                wednesday: 8.0,
                thursday: 8.0,
                friday: 8.0,
                saturday: 0.0,
                sunday: 0.0,
            }
        );

        assert_eq!(settings.theme, "#1976d2");
        assert_eq!(settings.theme_secondary, "#ce93d8");

        assert_eq!(settings.view_type.to_string(), "chronological");
        assert_eq!(settings.view_type, ViewType::Chronological);

        assert!(!settings.dark_mode);
        assert!(!settings.tour_completed);
    }

    #[test]
    fn update_settings() {
        // Setup
        let mut c = get_db_connection();
        let mut settings = SettingsRepository::get_settings(&mut c).unwrap();

        // Test
        settings.tour_completed = true;
        settings.right_sidebar_open = true;

        let response = SettingsRepository::update(&mut c, &settings);
        let settings = response.unwrap();

        assert_eq!(
            settings.work_hours,
            WorkHours {
                monday: 8.0,
                tuesday: 8.0,
                wednesday: 8.0,
                thursday: 8.0,
                friday: 8.0,
                saturday: 0.0,
                sunday: 0.0,
            }
        );
        assert_eq!(settings.theme, "#1976d2");
        assert_eq!(settings.theme_secondary, "#ce93d8");
        assert_eq!(settings.view_type, ViewType::Chronological);
        assert!(!settings.dark_mode);
        assert!(settings.tour_completed);
        assert!(settings.right_sidebar_open);
    }

    #[test]
    fn add_integration() {
        // Setup
        let mut c = get_db_connection();

        let redmine = NewIntegration {
            itype: IntegrationType::Redmine,
            active: true,
            name: None,
            config: JsonField(json!({"url": "https://redmine.org", "token": "123"})),
        };

        SettingsRepository::add_integration(&mut c, &redmine);
    }
}
