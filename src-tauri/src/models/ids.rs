use diesel::backend::Backend;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::sql_types::*;
use diesel::sqlite::Sqlite;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize, AsExpression, FromSqlRow, PartialEq)]
#[diesel(sql_type=Text)]
pub struct ListIds(pub Vec<i32>);

impl FromSql<Text, Sqlite> for ListIds {
    fn from_sql(value: <Sqlite as Backend>::RawValue<'_>) -> deserialize::Result<Self> {
        let text: String = FromSql::<Text, Sqlite>::from_sql(value)?;
        let ids: Vec<i32> = text.split(',').flat_map(str::parse::<i32>).collect();
        Ok(ListIds(ids))
    }
}
