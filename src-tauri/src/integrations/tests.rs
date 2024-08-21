#[cfg(test)]
mod tests {
    use serde_json::{json, Value};

    use crate::{
        integrations::{jira::Jira, redmine::Redmine, Integration},
        settings::{
            models::Setting,
            types::{json_field::JsonField, view_type::ViewType, work_hours::WorkHours},
        },
    };

    fn get_settings(json_value: Value) -> Setting {
        Setting {
            id: 1,
            integration: None,
            work_hours: WorkHours {
                monday: 8.0,
                tuesday: 8.0,
                wednesday: 8.0,
                thursday: 8.0,
                friday: 8.0,
                saturday: 0.0,
                sunday: 0.0,
            },
            theme: "#1976d2".to_string(),
            view_type: ViewType::Grouped,
            dark_mode: false,
            right_sidebar_open: false,
            theme_secondary: "#ce93d8".to_string(),
            integration_config: JsonField(json_value),
        }
    }

    #[test]
    fn redmine() {
        let integration = Redmine::new();

        let settings = get_settings(json!({}));
        assert!(!integration.is_valid(&settings));

        let settings = get_settings(json!({"url": "https://integration.com"}));
        assert!(!integration.is_valid(&settings));

        let settings = get_settings(json!({"url": "https://integration.com", "token": "1234"}));
        assert!(!integration.is_valid(&settings));

        let settings = get_settings(
            json!({"url": "https://integration.com", "token": "1234", "default_activity": "1"}),
        );
        assert!(integration.is_valid(&settings));
    }

    #[test]
    fn jira() {
        let integration = Jira::new();

        let settings = get_settings(json!({}));
        assert!(!integration.is_valid(&settings));

        let settings = get_settings(json!({"url": "https://integration.com"}));
        assert!(!integration.is_valid(&settings));

        let settings = get_settings(json!({"url": "https://integration.com", "token": "1234"}));
        assert!(!integration.is_valid(&settings));

        let settings = get_settings(
            json!({"url": "https://integration.com", "token": "1234", "email": "foo@foo.com"}),
        );
        assert!(integration.is_valid(&settings));
    }
}
