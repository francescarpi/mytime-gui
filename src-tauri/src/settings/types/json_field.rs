use diesel::backend::Backend;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::Text;
use diesel::sqlite::Sqlite;
use serde::{Deserialize, Serialize};
use serde_json::{to_string, Value};

#[derive(Debug, Clone, Deserialize, Serialize, AsExpression, FromSqlRow, PartialEq)]
#[diesel(sql_type=Text)]
pub struct JsonField(pub Value);

impl ToSql<Text, Sqlite> for JsonField {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Sqlite>) -> serialize::Result {
        let s = to_string(&self.0)?;
        out.set_value(s);
        Ok(IsNull::No)
    }
}

impl FromSql<Text, Sqlite> for JsonField {
    fn from_sql(value: <Sqlite as Backend>::RawValue<'_>) -> deserialize::Result<Self> {
        let t = <String as FromSql<Text, Sqlite>>::from_sql(value)?;
        Ok(Self(serde_json::from_str(&t)?))
    }
}
