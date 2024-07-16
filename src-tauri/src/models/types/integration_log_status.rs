use std::str::FromStr;

use diesel::backend::Backend;
use diesel::deserialize::{self, FromSql};
use diesel::serialize;
use diesel::{
    deserialize::FromSqlRow,
    expression::AsExpression,
    serialize::{IsNull, Output, ToSql},
    sql_types::Text,
    sqlite::Sqlite,
};
use serde::{Deserialize, Serialize};

#[derive(AsExpression, Debug, FromSqlRow, Serialize, Deserialize, PartialEq, Clone)]
#[diesel(sql_type=Text)]
pub enum IntegrationLogStatus {
    Pending,
    Sending,
    Success,
    Error,
}

impl ToString for IntegrationLogStatus {
    fn to_string(&self) -> String {
        match self {
            IntegrationLogStatus::Pending => String::from("pending"),
            IntegrationLogStatus::Sending => String::from("sending"),
            IntegrationLogStatus::Success => String::from("success"),
            IntegrationLogStatus::Error => String::from("error"),
        }
    }
}

impl FromStr for IntegrationLogStatus {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "pending" => Ok(IntegrationLogStatus::Pending),
            "sending" => Ok(IntegrationLogStatus::Sending),
            "success" => Ok(IntegrationLogStatus::Success),
            "error" => Ok(IntegrationLogStatus::Error),
            _ => Err(()),
        }
    }
}

impl ToSql<Text, Sqlite> for IntegrationLogStatus {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Sqlite>) -> serialize::Result {
        out.set_value(self.to_string());
        match self {
            IntegrationLogStatus::Pending => out.set_value("pending"),
            IntegrationLogStatus::Sending => out.set_value("sending"),
            IntegrationLogStatus::Success => out.set_value("success"),
            IntegrationLogStatus::Error => out.set_value("error"),
        };
        Ok(IsNull::No)
    }
}

impl FromSql<Text, Sqlite> for IntegrationLogStatus {
    fn from_sql(value: <Sqlite as Backend>::RawValue<'_>) -> deserialize::Result<Self> {
        let text: String = FromSql::<Text, Sqlite>::from_sql(value)?;
        match text.as_str() {
            "pending" => Ok(IntegrationLogStatus::Pending),
            "sending" => Ok(IntegrationLogStatus::Sending),
            "success" => Ok(IntegrationLogStatus::Success),
            "error" => Ok(IntegrationLogStatus::Error),
            _ => Err("Unknown integration log status".into()),
        }
    }
}
