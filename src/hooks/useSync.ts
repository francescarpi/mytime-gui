import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api";

export interface SyncTask {
  date: string;
  desc: string;
  duration: number;
  external_id: string;
  ids: number[];
}

const useSync = () => {
  const [tasks, setTasks] = useState<SyncTask[]>([]);

  const loadTasks = useCallback(() => {
    invoke("group_tasks").then((t) => setTasks(t as SyncTask[]));
  }, []);

  const send = (task: SyncTask): Promise<void> => {
    console.log("Send task", task);
    return invoke("send_to_integration", {
      externalId: task.external_id,
    });
  };

  return { tasks, loadTasks, send };
};

export default useSync;
