export interface Settings {
  integration: string
  integration_url: string
  integration_token: string
  work_hours: number[]
  theme: string
  view_type: string
  dark_mode: boolean
}

export interface Option {
  value: string
  label: string
}
