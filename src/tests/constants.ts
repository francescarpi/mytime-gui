import { Dayjs } from "dayjs";

export const defaultSettings = {
  dark_mode: true,
  id: 1,
  integration: null,
  integration_config: {},
  integration_valid: false,
  right_sidebar_open: false,
  theme: "#172ad3",
  theme_secondary: "#a69ea7",
  tour_completed: true,
  view_type: "Grouped",
  work_hours: {
    friday: 0,
    monday: 9,
    saturday: 0,
    sunday: 0,
    thursday: 9,
    tuesday: 9,
    wednesday: 9,
  },
};

export const defaultSummary = {
  goal_today: 32400,
  goal_week: 129600,
  is_running: false,
  pending_sync_tasks: 0,
  worked_month: 178991,
  worked_today: 0,
  worked_week: 0,
};

export const task1 = (date: Dayjs) => ({
  desc: "Task 1",
  duration: 60,
  end: date.hour(10).minute(1).second(0),
  external_id: "12345",
  favourite: false,
  id: 1,
  project: "FOO",
  reported: true,
  start: date.hour(10).minute(0).second(0),
});
