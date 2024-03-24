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
  has_running_tasks?: Boolean;
  children?: Task[];
}

export interface Summary {
  worked_today: number;
  worked_week: number;
  goal_today: number;
  goal_week: number;
  is_running: boolean;
  pending_sync_tasks: number;
}

const REFRESH_INTERVAL = 30000;

const useTasks = (date: Dayjs) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<Task[]>([]);
  const [intervalId, setIntervalId] = useState<any>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  const refresh = useCallback(() => {
    const d = date.format("YYYY-MM-DD");
    console.log("Refresh", d);
    invoke("tasks", { date: d }).then((res) => setTasks(res as Task[]));
    invoke("summary", { date: d }).then((res) => setSummary(res as Summary));
  }, [date]);

  useEffect(() => {
    refresh();
  }, [date, refresh]);

  useEffect(() => {
    if (intervalId) {
      console.log(`Previous Interval cleared: ${intervalId}`);
      clearInterval(intervalId);
      setIntervalId(null);
    }
    console.log("Interval registered");
    setIntervalId(setInterval(() => refresh(), REFRESH_INTERVAL));
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
          existingTask.has_running_tasks = true;
        }
        if (!task.reported) {
          existingTask.reported = false;
        }
      } else {
        acc.push({
          ...task,
          has_running_tasks: task.end === null,
          children: [task],
        });
      }
      return acc;
    }, []);
    setGroupedTasks(grouped);
  }, [tasks]);

  const addTask = (project: String, desc: String, externalId: String) => {
    invoke("create_task", { desc, project, externalId }).then(() => refresh());
  };

  const stopTask = (id: Number) => {
    invoke("stop_task", { id }).then(() => refresh());
  };

  const deleteTask = (id: Number) => {
    invoke("delete_task", { id }).then(() => refresh());
  };

  const copyToClipboard = (task: Task) => {
    const content = `[${task.project}] ${task.desc}`;
    navigator.clipboard.writeText(content);
  };

  const editTask = (task: Task) =>
    invoke("edit_task", { ...task }).then(() => refresh());

  return {
    tasks,
    groupedTasks,
    addTask,
    stopTask,
    copyToClipboard,
    deleteTask,
    editTask,
    refresh,
    summary,
  };
};

export default useTasks;
