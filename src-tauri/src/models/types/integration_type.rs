use std::str::FromStr;

use diesel::serialize;
use diesel::{
    deserialize::FromSqlRow,
    expression::AsExpression,
    serialize::{IsNull, Output, ToSql},
    sql_types::Text,
    sqlite::Sqlite,
};
use serde::{Deserialize, Serialize};

#[derive(AsExpression, Debug, FromSqlRow, Serialize, Deserialize)]
#[diesel(sql_type=Text)]
pub enum IntegrationType {
    Redmine,
    Jira,
}

impl ToString for IntegrationType {
    fn to_string(&self) -> String {
        match self {
            IntegrationType::Redmine => String::from("redmine"),
            IntegrationType::Jira => String::from("jira"),
        }
    }
}

impl FromStr for IntegrationType {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "redmine" => Ok(IntegrationType::Redmine),
            "jira" => Ok(IntegrationType::Jira),
            _ => Err(()),
        }
    }
}

impl ToSql<Text, Sqlite> for IntegrationType {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Sqlite>) -> serialize::Result {
        out.set_value(self.to_string());
        match self {
            IntegrationType::Redmine => out.set_value("redmine"),
            IntegrationType::Jira => out.set_value("jira"),
        };
        Ok(IsNull::No)
    }
}
