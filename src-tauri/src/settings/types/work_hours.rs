use core::fmt;
use diesel::backend::Backend;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::*;
use diesel::sqlite::Sqlite;
use serde::{Deserialize, Serialize};

// WorkHours is a struct that represents the work hours for each day of the week.
#[derive(Debug, Clone, Deserialize, Serialize, AsExpression, FromSqlRow, PartialEq)]
#[diesel(sql_type=Text)]
pub struct WorkHours {
    pub monday: f32,
    pub tuesday: f32,
    pub wednesday: f32,
    pub thursday: f32,
    pub friday: f32,
    pub saturday: f32,
    pub sunday: f32,
}

impl fmt::Display for WorkHours {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "{:.2},{:.2},{:.2},{:.2},{:.2},{:.2},{:.2}",
            self.monday,
            self.tuesday,
            self.wednesday,
            self.thursday,
            self.friday,
            self.saturday,
            self.sunday
        )
    }
}

impl FromSql<Text, Sqlite> for WorkHours {
    fn from_sql(value: <Sqlite as Backend>::RawValue<'_>) -> deserialize::Result<Self> {
        let text: String = FromSql::<Text, Sqlite>::from_sql(value)?;
        let hours: Vec<f32> = text.split(',').flat_map(str::parse::<f32>).collect();

        Ok(WorkHours {
            monday: hours[0],
            tuesday: hours[1],
            wednesday: hours[2],
            thursday: hours[3],
            friday: hours[4],
            saturday: hours[5],
            sunday: hours[6],
        })
    }
}

impl ToSql<Text, Sqlite> for WorkHours {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Sqlite>) -> serialize::Result {
        out.set_value(self.to_string());
        Ok(IsNull::No)
    }
}
