use diesel::deserialize::FromSqlRow;
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
