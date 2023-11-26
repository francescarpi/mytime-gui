export interface Task {
  id: number;
  project: string;
  desc: string;
  external_id: string;
  start: string;
  end: string | null;
  reported: boolean;
  shortcut: number | null;
  duration: number;
  has_runing_tasks?: boolean;
  children?: Task[];
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
  this_month: number;
  is_running: boolean;
  pending_sync_tasks: number;
}

export interface BtnOption {
  label: string;
  value: string;
}
