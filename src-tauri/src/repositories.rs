use chrono::Local;
use chrono::{Datelike, NaiveDate, NaiveTime};
use diesel::dsl::sql_query;
use diesel::prelude::*;
use diesel::sql_types::{Integer, Text};
use diesel::SqliteConnection;

use crate::models::*;
use crate::schema::*;

const DURATION_SQL: &str ="COALESCE(STRFTIME('%s', end), STRFTIME('%s', DATETIME('now', 'localtime'))) - STRFTIME('%s', start)";
const DEFAULT_TASKS_ORDER: &str = "start DESC, id";

pub struct SettingsRepository;

impl SettingsRepository {
    pub fn get_settings(c: &mut SqliteConnection) -> QueryResult<Setting> {
        settings::table.first::<Setting>(c)
    }

    pub fn update(c: &mut SqliteConnection, setting: &Setting) -> QueryResult<Setting> {
        diesel::update(settings::table.find(setting.id))
            .set(setting)
            .execute(c)
            .expect("Error updating settings");
        Self::get_settings(c)
    }
}

pub struct TasksRepository;

impl TasksRepository {
    pub fn add_task(
        c: &mut SqliteConnection,
        desc: String,
        external_id: Option<String>,
        project: Option<String>,
    ) -> QueryResult<TaskWithDuration> {
        let now = Local::now().naive_local();
        diesel::insert_into(tasks::table)
            .values((
                tasks::desc.eq(desc),
                tasks::external_id.eq(external_id),
                tasks::project.eq(project),
                tasks::start.eq(now),
            ))
            .execute(c)
            .expect("Error adding task");

        let last_id = Self::get_last_inserted_id(c);
        Self::get_task_with_duration(c, last_id)
    }

    pub fn get_task(c: &mut SqliteConnection, id: i32) -> QueryResult<Task> {
        tasks::table.find(id).get_result::<Task>(c)
    }

    pub fn get_task_with_duration(
        c: &mut SqliteConnection,
        id: i32,
    ) -> QueryResult<TaskWithDuration> {
        sql_query(format!(
            "SELECT *, {} AS duration FROM tasks WHERE id = $1",
            DURATION_SQL
        ))
        .bind::<Integer, _>(id)
        .get_result::<TaskWithDuration>(c)
    }

    pub fn get_last_inserted_id(c: &mut SqliteConnection) -> i32 {
        tasks::table
            .order(tasks::id.desc())
            .select(tasks::id)
            .limit(1)
            .first(c)
            .unwrap()
    }

    pub fn get_current_working_task_id(c: &mut SqliteConnection) -> Option<i32> {
        tasks::table
            .filter(tasks::end.is_null())
            .select(tasks::id)
            .first(c)
            .optional()
            .unwrap()
    }

    pub fn stop(c: &mut SqliteConnection, id: i32) -> QueryResult<TaskWithDuration> {
        let now = Local::now().naive_local();
        diesel::update(tasks::table.find(id))
            .set(tasks::end.eq(now))
            .execute(c)?;

        Self::get_task_with_duration(c, id)
    }

    pub fn edit(
        c: &mut SqliteConnection,
        id: i32,
        desc: String,
        start_time: NaiveTime,
        end_time: Option<NaiveTime>,
        external_id: Option<String>,
        project: Option<String>,
    ) -> QueryResult<TaskWithDuration> {
        let task = Self::get_task(c, id).unwrap();
        let new_start = task.start.date().and_time(start_time);
        let new_end = match end_time {
            Some(endt) => match task.end {
                Some(_) => Some(task.end.unwrap().date().and_time(endt)),
                None => None,
            },
            None => None,
        };

        diesel::update(tasks::table.find(id))
            .set((
                tasks::desc.eq(desc),
                tasks::start.eq(new_start),
                tasks::end.eq(new_end),
                tasks::external_id.eq(external_id),
                tasks::project.eq(project),
            ))
            .execute(c)?;
        Self::get_task_with_duration(c, id)
    }

    pub fn tasks_with_duration_by_date(
        c: &mut SqliteConnection,
        date: NaiveDate,
    ) -> QueryResult<Vec<TaskWithDuration>> {
        sql_query(format!(
            "SELECT *, {} AS duration FROM tasks WHERE DATE(start) = DATE($1) ORDER BY {}",
            DURATION_SQL, DEFAULT_TASKS_ORDER
        ))
        .bind::<Text, _>(date.to_string())
        .load(c)
    }

    pub fn search_tasks_with_duration(
        c: &mut SqliteConnection,
        query: &str,
        limit: Option<i32>,
    ) -> QueryResult<Vec<TaskWithDuration>> {
        let sql = if limit.is_some() {
            format!(
            "SELECT *, {} AS duration FROM tasks WHERE desc LIKE $1 OR project LIKE $1 ORDER BY {} LIMIT {}",
            DURATION_SQL, DEFAULT_TASKS_ORDER, limit.unwrap()
            )
        } else {
            format!(
            "SELECT *, {} AS duration FROM tasks WHERE desc LIKE $1 OR project LIKE $1 ORDER BY {}",
            DURATION_SQL, DEFAULT_TASKS_ORDER
            )
        };

        sql_query(sql)
            .bind::<Text, _>(format!("%{}%", query))
            .load(c)
    }

    pub fn worked_during_the_day(
        c: &mut SqliteConnection,
        date: NaiveDate,
    ) -> QueryResult<Duration> {
        sql_query(format!(
            "SELECT COALESCE(SUM({}), 0) AS duration FROM tasks WHERE STRFTIME('%Y-%m-%d', start) = $1",
            DURATION_SQL
        ))
        .bind::<Text, _>(date.to_string())
        .get_result(c)
    }

    pub fn worked_during_the_week(
        c: &mut SqliteConnection,
        date: NaiveDate,
    ) -> QueryResult<Duration> {
        let week_number = format!("{:02}", date.iso_week().week());
        sql_query(format!(
            "SELECT COALESCE(SUM({}), 0) AS duration FROM tasks WHERE STRFTIME('%W', start) = $1",
            DURATION_SQL
        ))
        .bind::<Text, _>(week_number)
        .get_result(c)
    }

    pub fn worked_during_the_month(
        c: &mut SqliteConnection,
        date: NaiveDate,
    ) -> QueryResult<Duration> {
        let month_number = format!("{:02}", date.month0() + 1);
        sql_query(format!(
            "SELECT COALESCE(SUM({}), 0) AS duration FROM tasks WHERE STRFTIME('%m', start) = $1",
            DURATION_SQL
        ))
        .bind::<Text, _>(month_number)
        .get_result(c)
    }

    pub fn are_tasks_running(c: &mut SqliteConnection) -> bool {
        tasks::table
            .filter(tasks::end.is_null())
            .count()
            .get_result::<i64>(c)
            .unwrap()
            > 0
    }

    pub fn delete_task(c: &mut SqliteConnection, id: i32) -> QueryResult<usize> {
        diesel::delete(tasks::table.find(id)).execute(c)
    }

    pub fn grouped_tasks(c: &mut SqliteConnection) -> QueryResult<Vec<GroupedTask>> {
        sql_query(format!(
            "
            SELECT
                external_id,
                SUM({}) AS duration,
                desc,
                STRFTIME('%Y-%m-%d', start) AS date,
                GROUP_CONCAT(id) AS ids
            FROM
                tasks
            WHERE
                end IS NOT NULL
                AND reported = false
                AND external_id IS NOT NULL
                AND external_id != ''
            GROUP BY
                external_id,
                desc,
                STRFTIME('%Y-%m-%d', start)
            ORDER BY
                STRFTIME('%Y-%m-%d', start) DESC
        ",
            DURATION_SQL
        ))
        .load(c)
    }

    pub fn mark_tasks_as_reported(
        c: &mut SqliteConnection,
        ids: String,
    ) -> Result<usize, diesel::result::Error> {
        let query = format!("UPDATE tasks SET reported = true WHERE id IN ({})", ids);
        sql_query(query).execute(c)
    }
}
