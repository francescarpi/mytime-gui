ALTER TABLE settings DROP COLUMN integration_url;
ALTER TABLE settings DROP COLUMN integration_token;
ALTER TABLE settings DROP COLUMN integration_extra_param;
ALTER TABLE settings DROP COLUMN integration_username;
ALTER TABLE settings DROP COLUMN tour_completed;
ALTER TABLE settings ADD integration_config TEXT NOT NULL DEFAULT '{}';

