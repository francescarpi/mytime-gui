-- This file should undo anything in `up.sql`
ALTER TABLE settings ADD COLUMN integration VARCHAR;
ALTER TABLE settings ADD COLUMN integration_url VARCHAR;
ALTER TABLE settings ADD COLUMN integration_token VARCHAR;
ALTER TABLE settings ADD COLUMN integration_extra_param VARCHAR DEFAULT NULL;
ALTER TABLE settings ADD COLUMN integration_username VARCHAR;
