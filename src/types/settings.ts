export interface Settings {
  integration: string;
  integration_url: string;
  integration_token: string;
  work_hours_monday: number;
  work_hours_tuesday: number;
  work_hours_wednesday: number;
  work_hours_thursday: number;
  work_hours_friday: number;
  work_hours_saturday: number;
  work_hours_sunday: number;
  theme: string;
}

export interface Option {
  value: string;
  label: string;
}
