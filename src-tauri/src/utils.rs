pub mod dates {
    pub fn change_time(datetime: &str, new_time: &str) -> String {
        use chrono::{DateTime, Local, Timelike};

        let start = DateTime::parse_from_rfc3339(datetime)
            .unwrap()
            .with_timezone(&Local);

        let parts = new_time.split(':');
        let collection: Vec<&str> = parts.collect();
        let hour = collection.first().unwrap().parse::<u32>().unwrap();
        let minutes = collection.get(1).unwrap().parse::<u32>().unwrap();

        let new_date = start.with_hour(hour).unwrap().with_minute(minutes).unwrap();

        new_date.to_rfc3339()
    }
}
