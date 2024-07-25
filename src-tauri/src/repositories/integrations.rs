use crate::models::models::{Integration, IntegrationLog, NewIntegration, NewIntegrationLog};
use crate::schema::{integrations, integrations_log};
use diesel::prelude::*;
use diesel::{QueryResult, SqliteConnection};

pub struct IntegrationsRepository;

impl IntegrationsRepository {
    pub fn add_integration(c: &mut SqliteConnection, new_integration: &NewIntegration) {
        diesel::insert_into(integrations::table)
            .values(new_integration)
            .execute(c)
            .expect("Error adding integration");
    }

    pub fn integrations(c: &mut SqliteConnection) -> QueryResult<Vec<Integration>> {
        integrations::table.load::<Integration>(c)
    }

    pub fn integration(c: &mut SqliteConnection, id: i32) -> QueryResult<Integration> {
        integrations::table.find(id).get_result::<Integration>(c)
    }

    pub fn update_integration(c: &mut SqliteConnection, integration: &Integration) {
        diesel::update(integrations::table.find(integration.id))
            .set(integration)
            .execute(c)
            .expect("Error updating integration");
    }

    pub fn delete_integration(c: &mut SqliteConnection, id: i32) {
        diesel::delete(integrations::table.find(id))
            .execute(c)
            .expect("Error deleting integration");
    }

    pub fn add_integration_log(
        c: &mut SqliteConnection,
        new_integration_log: &NewIntegrationLog,
    ) -> QueryResult<IntegrationLog> {
        diesel::insert_into(integrations_log::table)
            .values(new_integration_log)
            .execute(c)
            .expect("Error adding integration log");
        Self::get_integration_log(
            c,
            &new_integration_log.task_id,
            new_integration_log.integration_id,
        )
    }

    pub fn update_external_id(
        c: &mut SqliteConnection,
        log: &IntegrationLog,
        external_id: &String,
    ) {
        diesel::update(integrations_log::table.find(log.id))
            .set(integrations_log::external_id.eq(external_id))
            .execute(c)
            .expect("Error updating integration log");
    }

    pub fn get_integration_log(
        c: &mut SqliteConnection,
        task_id: &String,
        integration_id: i32,
    ) -> QueryResult<IntegrationLog> {
        integrations_log::table
            .filter(integrations_log::task_id.eq(task_id))
            .filter(integrations_log::integration_id.eq(integration_id))
            .get_result::<IntegrationLog>(c)
    }

    pub fn get_or_create_integration_log(
        c: &mut SqliteConnection,
        new_integration_log: &NewIntegrationLog,
    ) -> IntegrationLog {
        if let Ok(log) = Self::get_integration_log(
            c,
            &new_integration_log.task_id,
            new_integration_log.integration_id,
        ) {
            Self::update_external_id(c, &log, &new_integration_log.external_id);
            log
        } else {
            Self::add_integration_log(c, new_integration_log).unwrap()
        }
    }
}
