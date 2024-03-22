import { useState } from "react";

export interface Task {
  id: Number;
  project: String;
  desc: String;
  external_id: String;
  start: String;
  end: String | null;
  reported: Boolean;
  shortcut: Number | null;
  duration: Number;
  has_runing_tasks?: boolean;
  children?: Task[];
}

const useTasks = (date: Date) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  return { tasks };
};

export default useTasks;
