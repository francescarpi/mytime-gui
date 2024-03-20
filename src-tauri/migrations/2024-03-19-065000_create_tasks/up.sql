CREATE TABLE tasks (
  id                  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  desc                VARCHAR NOT NULL,
  start               TIMESTAMP NOT NULL,
  end                 TIMESTAMP DEFAULT NULL,
  reported            BOOLEAN NOT NULL DEFAULT false,
  external_id         VARCHAR DEFAULT NULL,
  project             VARCHAR DEFAULT NULL
)
