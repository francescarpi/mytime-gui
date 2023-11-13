export interface Task {
  id: number
  project: string
  desc: string
  external_id: string
  start: string
  end: string | null
  reported: boolean
}

export interface Project {
  label: string
  value: string
}

export interface ExternalID {
  label: string
  value: string
}

export interface Summary {
  today: number
  this_week: number
  is_running: boolean
}
