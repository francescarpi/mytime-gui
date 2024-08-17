extern crate app;

pub mod common;

#[cfg(test)]
mod tests {
    use app::models::integration::IntegrationType;
    use app::models::types::view_type::ViewType;
    use app::models::work_hours::WorkHours;
    use app::repositories::settings::SettingsRepository;

    use crate::common::get_db_connection;

    #[test]
    fn create_default_settings() {
        // Setup
        let mut c = get_db_connection();

        // Test
        let settings = SettingsRepository::get_settings(&mut c).unwrap();
        assert_eq!(settings.integration, None);
        assert_eq!(settings.integration_url, None);
        assert_eq!(settings.integration_token, None);
        assert_eq!(settings.integration_username, None);
        assert_eq!(settings.integration_extra_param, None);
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
        settings.integration = Some(IntegrationType::Redmine);
        settings.integration_url = Some("http://foo.com".to_string());
        settings.integration_token = Some("12345".to_string());
        settings.integration_username = Some("foo@foo.com".to_string());
        settings.integration_extra_param = Some("1".to_string());
        settings.tour_completed = true;
        settings.right_sidebar_open = true;

        let response = SettingsRepository::update(&mut c, &settings);
        let settings = response.unwrap();

        assert_eq!(settings.integration, Some(IntegrationType::Redmine));
        assert_eq!(settings.integration_url, Some("http://foo.com".to_string()));
        assert_eq!(settings.integration_token, Some("12345".to_string()));
        assert_eq!(
            Some("foo@foo.com".to_string()),
            settings.integration_username,
        );
        assert_eq!(settings.integration_extra_param, Some("1".to_string()));
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
}
