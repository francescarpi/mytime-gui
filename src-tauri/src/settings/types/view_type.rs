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
pub enum ViewType {
    Chronological,
    Grouped,
}

impl FromSql<Text, Sqlite> for ViewType {
    fn from_sql(value: <Sqlite as Backend>::RawValue<'_>) -> deserialize::Result<Self> {
        let text: String = FromSql::<Text, Sqlite>::from_sql(value)?;
        match text.as_str() {
            "chronological" => Ok(ViewType::Chronological),
            "grouped" => Ok(ViewType::Grouped),
            _ => Err("Unknown view type".into()),
        }
    }
}

impl ToSql<Text, Sqlite> for ViewType {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Sqlite>) -> serialize::Result {
        out.set_value(self.to_string());
        Ok(IsNull::No)
    }
}

impl fmt::Display for ViewType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ViewType::Chronological => write!(f, "chronological"),
            ViewType::Grouped => write!(f, "grouped"),
        }
    }
}
