export interface WorkHours {
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
}

export interface Settings {
  integration: string
  integration_url: string
  integration_token: string
  work_hours: WorkHours
  theme: string
  view_type: string
  dark_mode: boolean
  tour_completed: boolean
}

export interface Option {
  value: string | null
  label: string
}
