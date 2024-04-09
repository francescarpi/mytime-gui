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

  const send = (index: number): Promise<void> => {
    console.log("Send task with index:", index);
    return invoke("send_to_integration", {
      index,
    });
  };

  return { tasks, loadTasks, send };
};

export default useSync;
