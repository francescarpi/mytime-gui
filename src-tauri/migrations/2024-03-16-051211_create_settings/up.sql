CREATE TABLE settings (
  id                  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  integration         VARCHAR,
  integration_url     VARCHAR,
  integration_token   VARCHAR,
  work_hours          VARCHAR NOT NULL,
  theme               VARCHAR NOT NULL,
  view_type           VARCHAR NOT NULL,
  dark_mode           BOOLEAN NOT NULL,
  tour_completed      BOOLEAN NOT NULL
)
