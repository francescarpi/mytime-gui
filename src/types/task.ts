export interface Task {
  id: number;
  project: string;
  desc: string;
  external_id: string;
  start: string;
  end: string | null;
  reported: boolean;
  number: number | null;
  duration: number;
  total_tasks?: number;
}

export interface Project {
  label: string;
  value: string;
}

export interface ExternalID {
  label: string;
  value: string;
}

export interface Summary {
  today: number;
  this_week: number;
  is_running: boolean;
  pending_sync_tasks: number;
}

export interface BtnOption {
  label: string;
  value: string;
}
