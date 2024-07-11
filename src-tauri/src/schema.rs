// @generated automatically by Diesel CLI.

diesel::table! {
    integrations (id) {
        id -> Integer,
        itype -> Text,
        active -> Bool,
        name -> Nullable<Text>,
        config -> Text,
    }
}

diesel::table! {
    integrations_log (id) {
        id -> Integer,
        task_id -> Text,
        integration_id -> Integer,
        external_id -> Text,
        status -> Text,
        created_at -> Timestamp,
        log -> Nullable<Text>,
    }
}

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

diesel::joinable!(integrations_log -> integrations (integration_id));

diesel::allow_tables_to_appear_in_same_query!(
    integrations,
    integrations_log,
    settings,
    tasks,
);
