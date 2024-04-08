extern crate app;

pub mod common;

#[cfg(test)]
mod tests {
    use crate::common::get_db_connection;
    use app::repositories::TasksRepository;
    use chrono::{offset::Local, Datelike, NaiveTime, Timelike};

    #[test]
    fn add_task() {
        // Setup
        let mut c = get_db_connection();

        // Test
        let now = Local::now().naive_local();
        let response = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None);
        let new_task = response.unwrap();

        assert_eq!(new_task.id, 1);
        assert_eq!(new_task.desc, "Test task");
        assert!(!new_task.reported);
        assert_eq!(new_task.external_id, None);
        assert_eq!(new_task.project, None);
        assert_eq!(new_task.end, None);
        assert_eq!(new_task.start.date(), now.date());
        assert_eq!(new_task.start.time().hour(), now.time().hour());
        assert_eq!(new_task.start.time().minute(), now.time().minute());
        assert!(new_task.duration >= 0);
        assert!(!new_task.favourite);
    }

    #[test]
    fn stop_task() {
        // Setup
        let mut c = get_db_connection();
        let task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();

        // Test
        let task = TasksRepository::stop(&mut c, task.id).expect("Error stopping task");
        assert!(task.end.is_some());
        assert!(task.duration >= 0);
    }

    #[test]
    fn edit_task() {
        // Setup
        let mut c = get_db_connection();
        let task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();
        TasksRepository::stop(&mut c, task.id).unwrap();

        // Test
        let start = NaiveTime::from_hms_opt(10, 0, 0).unwrap();
        let end = Some(NaiveTime::from_hms_opt(11, 0, 0).unwrap());
        let new_task = TasksRepository::edit(
            &mut c,
            task.id,
            "Edited task".to_string(),
            start,
            end,
            Some("1234".to_string()),
            Some("Foo".to_string()),
        );

        let new_task = new_task.unwrap();
        assert_eq!(new_task.desc, "Edited task");
        assert_eq!(new_task.external_id, Some("1234".to_string()));
        assert_eq!(new_task.project, Some("Foo".to_string()));
        assert_eq!(new_task.start.time(), start);
        assert_eq!(Some(new_task.end.unwrap().time()), end);
        assert_eq!(new_task.duration, 3600);
    }

    #[test]
    fn get_working_task() {
        // Setup
        let mut c = get_db_connection();
        let _task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();

        // Test
        let task = TasksRepository::get_current_working_task_id(&mut c);
        assert!(task.is_some());
        assert_eq!(task.unwrap(), 1);
    }

    #[test]
    fn tasks_with_duration_by_date() {
        // Setup
        let mut c = get_db_connection();
        let _task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();
        let today = Local::now().naive_local().date();

        // Test
        let tasks = TasksRepository::tasks_with_duration_by_date(&mut c, today).unwrap();
        assert_eq!(tasks.len(), 1);
        assert_eq!(tasks[0].id, 1);
    }

    #[test]
    fn search_tasks() {
        // Setup
        let mut c = get_db_connection();
        let _ = TasksRepository::add_task(
            &mut c,
            "Task 1".to_string(),
            None,
            Some("Project 1".to_string()),
        )
        .unwrap();
        let _ = TasksRepository::add_task(
            &mut c,
            "Task 2".to_string(),
            None,
            Some("Project 1".to_string()),
        )
        .unwrap();
        let _ = TasksRepository::add_task(
            &mut c,
            "Task 3".to_string(),
            None,
            Some("Project 2".to_string()),
        )
        .unwrap();

        // Test
        let tasks = TasksRepository::search_tasks_with_duration(&mut c, "Project 1", None).unwrap();
        assert_eq!(tasks.len(), 2);
        assert_eq!(tasks[0].desc, "Task 2");
        assert_eq!(tasks[1].desc, "Task 1");
        assert!(!tasks[0].favourite);

        let tasks =
            TasksRepository::search_tasks_with_duration(&mut c, "Project 1", Some(1)).unwrap();
        assert_eq!(tasks.len(), 1);

        let tasks = TasksRepository::search_tasks_with_duration(&mut c, "Project 2", None).unwrap();
        assert_eq!(tasks.len(), 1);
        assert_eq!(tasks[0].desc, "Task 3");

        let tasks = TasksRepository::search_tasks_with_duration(&mut c, "ask 1", None).unwrap();
        assert_eq!(tasks.len(), 1);
        assert_eq!(tasks[0].desc, "Task 1");
    }

    #[test]
    fn worked() {
        // Setup
        let mut c = get_db_connection();
        let _task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();
        let today = Local::now().naive_local().date();

        // Test
        let response = TasksRepository::worked_during_the_day(&mut c, today).unwrap();
        assert!(response.duration >= 0);

        let response = TasksRepository::worked_during_the_week(&mut c, today).unwrap();
        assert!(response.duration >= 0);

        let response = TasksRepository::worked_during_the_month(&mut c, today).unwrap();
        assert!(response.duration >= 0);
    }

    #[test]
    fn tasks_running() {
        // Setup
        let mut c = get_db_connection();
        let task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();

        // Test
        let running = TasksRepository::are_tasks_running(&mut c);
        assert!(running);

        TasksRepository::stop(&mut c, task.id).unwrap();
        let running = TasksRepository::are_tasks_running(&mut c);
        assert!(!running);
    }

    #[test]
    fn delete_task() {
        // Setup
        let mut c = get_db_connection();
        let task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();

        // Test
        let response = TasksRepository::delete_task(&mut c, task.id);
        assert!(response.is_ok());
    }

    #[test]
    fn grouped_tasks() {
        // Setup
        let mut c = get_db_connection();
        let today = Local::now().naive_local().date();
        let task1 = TasksRepository::add_task(
            &mut c,
            "Test task".to_string(),
            Some("1234".to_string()),
            None,
        )
        .unwrap();
        let task2 = TasksRepository::add_task(
            &mut c,
            "Test task".to_string(),
            Some("1234".to_string()),
            None,
        )
        .unwrap();

        let _ = TasksRepository::stop(&mut c, task1.id);
        let _ = TasksRepository::stop(&mut c, task2.id);

        // Test
        let response = TasksRepository::grouped_tasks(&mut c).unwrap();

        assert_eq!(response.len(), 1);
        assert_eq!(response[0].external_id, "1234");
        assert!(response[0].duration >= 0);
        assert_eq!(response[0].desc, "Test task");
        assert_eq!(response[0].date, today);
        assert_eq!(response[0].ids.0.len(), 2);
        assert_eq!(response[0].ids.0[0], task1.id);
        assert_eq!(response[0].ids.0[1], task2.id);
    }

    #[test]
    fn mark_tasks_as_reported() {
        // Setup
        let mut c = get_db_connection();
        let task1 = TasksRepository::add_task(
            &mut c,
            "Test task".to_string(),
            Some("1234".to_string()),
            None,
        )
        .unwrap();
        let task2 = TasksRepository::add_task(
            &mut c,
            "Test task".to_string(),
            Some("1234".to_string()),
            None,
        )
        .unwrap();
        let _ = TasksRepository::stop(&mut c, task1.id);
        let _ = TasksRepository::stop(&mut c, task2.id);

        // Test
        let response =
            TasksRepository::mark_tasks_as_reported(&mut c, format!("{},{}", task1.id, task2.id));
        assert!(response.is_ok());

        let tasks = TasksRepository::grouped_tasks(&mut c).unwrap();
        assert_eq!(tasks.len(), 0);
    }

    #[test]
    fn dates_with_tasks() {
        // Setup
        let mut c = get_db_connection();
        let now = Local::now().naive_local();
        let _ = TasksRepository::add_task(
            &mut c,
            "Test task".to_string(),
            Some("1234".to_string()),
            None,
        )
        .unwrap();

        // Test
        let response = TasksRepository::dates_with_tasks(&mut c, now.month(), now.year()).unwrap();
        assert_eq!(response.len(), 1);
        assert_eq!(response[0].date, now.date());
    }

    #[test]
    fn toggle_favourite() {
        // Setup
        let mut c = get_db_connection();
        let task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();
        assert!(!task.favourite);

        // Test
        let _ = TasksRepository::toggle_favourite(&mut c, task.id);
        let task = TasksRepository::get_task(&mut c, task.id).unwrap();
        assert!(task.favourite);

        let _ = TasksRepository::toggle_favourite(&mut c, task.id);
        let task = TasksRepository::get_task(&mut c, task.id).unwrap();
        assert!(!task.favourite);
    }

    #[test]
    fn favourites() {
        // Setup
        let mut c = get_db_connection();
        let task = TasksRepository::add_task(&mut c, "Test task".to_string(), None, None).unwrap();
        let _ = TasksRepository::toggle_favourite(&mut c, task.id);

        // Test
        let tasks = TasksRepository::favourites(&mut c).unwrap();
        assert_eq!(tasks.len(), 1);

        let _ = TasksRepository::toggle_favourite(&mut c, task.id);
        let tasks = TasksRepository::favourites(&mut c).unwrap();
        assert_eq!(tasks.len(), 0);
    }
}
