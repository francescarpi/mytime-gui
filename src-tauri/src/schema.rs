// @generated automatically by Diesel CLI.

diesel::table! {
    settings (id) {
        id -> Integer,
        integration -> Nullable<Text>,
        integration_url -> Nullable<Text>,
        integration_token -> Nullable<Text>,
        work_hours -> Text,
        theme -> Text,
        view_type -> Text,
        dark_mode -> Bool,
        tour_completed -> Bool,
    }
}

diesel::table! {
    tasks (id) {
        id -> Integer,
        desc -> Text,
        start -> Timestamp,
        end -> Nullable<Timestamp>,
        reported -> Bool,
        external_id -> Nullable<Text>,
        project -> Nullable<Text>,
        favourite -> Bool,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    settings,
    tasks,
);
