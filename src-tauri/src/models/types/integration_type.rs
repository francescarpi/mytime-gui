use core::fmt;
use diesel::backend::Backend;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::*;
use diesel::sqlite::Sqlite;
use serde::{Deserialize, Serialize};

// ViewType is an enum that represents the different ways to display the tasks in the app.
#[derive(Debug, Clone, Deserialize, Serialize, AsExpression, FromSqlRow, PartialEq)]
#[diesel(sql_type=Text)]
pub enum IntegrationType {
    Redmine,
    Jira,
}

impl FromSql<Text, Sqlite> for IntegrationType {
    fn from_sql(value: <Sqlite as Backend>::RawValue<'_>) -> deserialize::Result<Self> {
        let text: String = FromSql::<Text, Sqlite>::from_sql(value)?;
        match text.as_str() {
            "redmine" => Ok(IntegrationType::Redmine),
            "jira" => Ok(IntegrationType::Jira),
            _ => Err("Unknown integration".into()),
        }
    }
}

impl ToSql<Text, Sqlite> for IntegrationType {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Sqlite>) -> serialize::Result {
        out.set_value(self.to_string());
        Ok(IsNull::No)
    }
}

impl fmt::Display for IntegrationType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            IntegrationType::Redmine => write!(f, "redmine"),
            IntegrationType::Jira => write!(f, "jira"),
        }
    }
}
