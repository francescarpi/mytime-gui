-- This file should undo anything in `up.sql`
ALTER TABLE tasks
    ADD COLUMN external_id VARCHAR DEFAULT NULL;
