extern crate app;

pub mod common;

#[cfg(test)]
mod tests {
    use crate::common::add_integration;
    use crate::common::get_db_connection;

    use app::models::models::{NewIntegration, NewIntegrationLog};
    use app::models::types::integration_type::IntegrationType;
    use app::models::types::json_field::JsonField;
    use app::repositories::IntegrationsRepository;
    use serde_json::json;

    #[test]
    fn add_integration_test() {
        let mut c = get_db_connection();

        // No integrations in the initial state
        assert_eq!(
            IntegrationsRepository::integrations(&mut c).unwrap().len(),
            0
        );

        // Add first integration settings (redmine)
        let integration1 = NewIntegration {
            itype: IntegrationType::Redmine,
            active: true,
            name: None,
            config: JsonField(json!({"url": "https://redmine.org", "token": "123"})),
        };
        IntegrationsRepository::add_integration(&mut c, &integration1);

        // Add first integration settings (jira 1)
        let integration2 = NewIntegration {
            itype: IntegrationType::Jira,
            active: true,
            name: None,
            config: JsonField(json!({"url": "https://jira.org", "user": "foo", "token": "123"})),
        };
        IntegrationsRepository::add_integration(&mut c, &integration2);

        // Add first integration settings (jira 2)
        let integration3 = NewIntegration {
            itype: IntegrationType::Jira,
            active: true,
            name: Some("Jira 2".to_string()),
            config: JsonField(json!({"url": "https://jira.org", "user": "foo", "token": "123"})),
        };
        IntegrationsRepository::add_integration(&mut c, &integration3);

        // Check total integrations
        let inteagrations = IntegrationsRepository::integrations(&mut c).unwrap();
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
        let mut integration = add_integration(&mut c);
        assert!(!integration.active);

        // Test
        integration.active = true;
        IntegrationsRepository::update_integration(&mut c, &integration);

        let integrations = IntegrationsRepository::integrations(&mut c).unwrap();
        assert_eq!(integrations[0].active, true);
    }

    #[test]
    fn delete_integration() {
        // Setup
        let mut c = get_db_connection();
        let integration = add_integration(&mut c);

        // Test
        IntegrationsRepository::delete_integration(&mut c, integration.id);
        let integrations = IntegrationsRepository::integrations(&mut c).unwrap();
        assert_eq!(integrations.len(), 0);
    }

    #[test]
    fn get_integration() {
        // Setup
        let mut c = get_db_connection();
        let integration = add_integration(&mut c);

        // Test
        let integration = IntegrationsRepository::integration(&mut c, integration.id).unwrap();
        assert_eq!(integration.id, integration.id);
        assert_eq!(integration.itype, integration.itype);
    }

    #[test]
    fn create_and_consume_log() {
        // Setup
        let mut c = get_db_connection();
        let integration = add_integration(&mut c);

        // Test
        let log = NewIntegrationLog {
            task_id: "1-2-3".to_string(),
            integration_id: integration.id,
            external_id: "12345".to_string(),
        };

        IntegrationsRepository::add_integration_log(&mut c, &log).unwrap();

        let log = IntegrationsRepository::get_integration_log(
            &mut c,
            &"1-2-3".to_string(),
            integration.id,
        )
        .unwrap();

        assert_eq!(log.id, 1);
        assert_eq!(log.task_id, "1-2-3".to_string());
        assert_eq!(log.integration_id, integration.id);
        assert_eq!(log.external_id, "12345".to_string());
        assert_eq!(log.status, "sending".to_string()); // TODO: change by object
        assert_eq!(log.log, None);
    }

    #[test]
    fn get_or_create_log() {
        // Setup
        let mut c = get_db_connection();
        let integration = add_integration(&mut c);

        // Test
        let log = NewIntegrationLog {
            task_id: "1-2-3".to_string(),
            integration_id: integration.id,
            external_id: "12345".to_string(),
        };

        let new_log = IntegrationsRepository::get_or_create_integration_log(&mut c, &log);
        assert_eq!(new_log.id, 1);

        let new_log = IntegrationsRepository::get_or_create_integration_log(&mut c, &log);
        assert_eq!(new_log.id, 1);
    }
}
