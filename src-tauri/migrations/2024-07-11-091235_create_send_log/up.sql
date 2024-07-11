-- Your SQL goes here
CREATE TABLE integrations_log (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    task_id VARCHAR NOT NULL,
    integration_id INTEGER NOT NULL,
    external_id VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'sending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    log TEXT DEFAULT NULL,

    FOREIGN KEY(integration_id) REFERENCES integrations(id),
    UNIQUE(task_id, integration_id)
);

CREATE INDEX idx_task_id ON integrations_log(task_id);
CREATE INDEX idx_integration_id ON integrations_log(integration_id);
