// @generated automatically by Diesel CLI.

diesel::table! {
    settings (id) {
        id -> Integer,
        work_hours -> Text,
        theme -> Text,
        view_type -> Text,
        dark_mode -> Bool,
        tour_completed -> Bool,
        right_sidebar_open -> Bool,
        theme_secondary -> Text,
    }
}

diesel::table! {
    tasks (id) {
        id -> Integer,
        desc -> Text,
        start -> Timestamp,
        end -> Nullable<Timestamp>,
        reported -> Bool,
        project -> Nullable<Text>,
        favourite -> Bool,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    settings,
    tasks,
);
