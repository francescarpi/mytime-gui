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
        let mut c = get_db_connection();

        // No integrations in the initial state
        assert_eq!(SettingsRepository::integrations(&mut c).unwrap().len(), 0);

        // Add first integration settings (redmine)
        let integration1 = NewIntegration {
            itype: IntegrationType::Redmine,
            active: true,
            name: None,
            config: JsonField(json!({"url": "https://redmine.org", "token": "123"})),
        };
        SettingsRepository::add_integration(&mut c, &integration1);

        // Add first integration settings (jira 1)
        let integration2 = NewIntegration {
            itype: IntegrationType::Jira,
            active: true,
            name: None,
            config: JsonField(json!({"url": "https://jira.org", "user": "foo", "token": "123"})),
        };
        SettingsRepository::add_integration(&mut c, &integration2);

        // Add first integration settings (jira 2)
        let integration3 = NewIntegration {
            itype: IntegrationType::Jira,
            active: true,
            name: Some("Jira 2".to_string()),
            config: JsonField(json!({"url": "https://jira.org", "user": "foo", "token": "123"})),
        };
        SettingsRepository::add_integration(&mut c, &integration3);

        // Check total integrations
        let inteagrations = SettingsRepository::integrations(&mut c).unwrap();
        assert_eq!(inteagrations.len(), 3);

        // Checking stored data
        // Integration 1
        assert_eq!(inteagrations[0].id, 1);
        assert_eq!(inteagrations[0].itype, IntegrationType::Redmine);
        assert!(inteagrations[0].active);
        assert_eq!(inteagrations[0].name, None);
        assert_eq!(
            inteagrations[0].config.0["url"],
            "https://redmine.org".to_string()
        );
        assert_eq!(inteagrations[0].config.0["token"], "123".to_string());

        // Integration 2
        assert_eq!(inteagrations[1].id, 2);
        assert_eq!(inteagrations[1].itype, IntegrationType::Jira);
        assert!(inteagrations[1].active);
        assert_eq!(inteagrations[1].name, None);
        assert_eq!(
            inteagrations[1].config.0["url"],
            "https://jira.org".to_string()
        );
        assert_eq!(inteagrations[1].config.0["token"], "123".to_string());

        // Integration 3
        assert_eq!(inteagrations[2].id, 3);
        assert_eq!(inteagrations[2].itype, IntegrationType::Jira);
        assert!(inteagrations[2].active);
        assert_eq!(inteagrations[2].name, Some("Jira 2".to_string()));
        assert_eq!(
            inteagrations[2].config.0["url"],
            "https://jira.org".to_string()
        );
        assert_eq!(inteagrations[2].config.0["token"], "123".to_string());
    }

    #[test]
    fn update_integration() {
        // Setup
        let mut c = get_db_connection();
        let integration1 = NewIntegration {
            itype: IntegrationType::Redmine,
            active: false,
            name: None,
            config: JsonField(json!({"url": "https://redmine.org", "token": "123"})),
        };
        SettingsRepository::add_integration(&mut c, &integration1);
        let integrations = SettingsRepository::integrations(&mut c).unwrap();
        let mut integration = integrations[0].clone();

        assert!(!integration.active);

        // Test
        integration.active = true;
        SettingsRepository::update_integration(&mut c, &integration);

        let integrations = SettingsRepository::integrations(&mut c).unwrap();
        assert_eq!(integrations[0].active, true);
    }

    #[test]
    fn delete_integration() {
        // Setup
        let mut c = get_db_connection();
        let integration1 = NewIntegration {
            itype: IntegrationType::Redmine,
            active: false,
            name: None,
            config: JsonField(json!({"url": "https://redmine.org", "token": "123"})),
        };
        SettingsRepository::add_integration(&mut c, &integration1);
        let integrations = SettingsRepository::integrations(&mut c).unwrap();
        assert_eq!(integrations.len(), 1);
        let integration = integrations[0].clone();

        // Test
        SettingsRepository::delete_integration(&mut c, integration.id);
        let integrations = SettingsRepository::integrations(&mut c).unwrap();
        assert_eq!(integrations.len(), 0);
    }

    #[test]
    fn get_integration() {
        // Setup
        let mut c = get_db_connection();
        let integration1 = NewIntegration {
            itype: IntegrationType::Redmine,
            active: false,
            name: None,
            config: JsonField(json!({"url": "https://redmine.org", "token": "123"})),
        };
        SettingsRepository::add_integration(&mut c, &integration1);
        let integrations = SettingsRepository::integrations(&mut c).unwrap();
        assert_eq!(integrations.len(), 1);
        let added_integration = integrations[0].clone();

        // Test
        let integration = SettingsRepository::integration(&mut c, added_integration.id).unwrap();
        assert_eq!(integration.id, added_integration.id);
        assert_eq!(integration.itype, added_integration.itype);
    }
}
