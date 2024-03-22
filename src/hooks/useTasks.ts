import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api";
import { Dayjs } from "dayjs";

export interface Task {
  id: Number;
  project: String;
  desc: String;
  external_id: String;
  start: String;
  end: String | null;
  reported: Boolean;
  shortcut: Number | null;
  duration: number;
  has_runing_tasks?: Boolean;
  children?: Task[];
}

const useTasks = (date: Dayjs) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<Task[]>([]);

  const refresh = useCallback(() => {
    invoke("tasks", { date: date.format("YYYY-MM-DD") }).then((res) =>
      setTasks(res as Task[]),
    );
  }, [date]);

  useEffect(() => {
    refresh();
  }, [date, refresh]);

  useEffect(() => {
    setInterval(() => {
      refresh();
    }, 30000);
  }, [refresh]);

  useEffect(() => {
    const grouped: Task[] = tasks.reduce((acc: Task[], task: Task) => {
      const existingTask: Task | undefined = acc.find(
        (t: Task) =>
          t.desc === task.desc &&
          t.project === task.project &&
          t.external_id === task.external_id,
      );
      if (existingTask) {
        existingTask.duration += task.duration;
        (existingTask.children as Task[]).push(task);
        if (task.end === null) {
          existingTask.has_runing_tasks = true;
        }
        if (!task.reported) {
          existingTask.reported = false;
        }
      } else {
        acc.push({
          ...task,
          has_runing_tasks: task.end === null,
          children: [task],
        });
      }
      return acc;
    }, []);
    setGroupedTasks(grouped);
  }, [tasks]);

  return { tasks, groupedTasks };
};

export default useTasks;
