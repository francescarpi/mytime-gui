import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api";

export interface SyncTask {
  id: string;
  date: string;
  desc: string;
  duration: number;
  external_id: string;
  ids: number[];
  extra_param: string | null;
}

const useSync = (integration_extra_param: string | null) => {
  const [tasks, setTasks] = useState<SyncTask[]>([]);

  const loadTasks = useCallback(() => {
    invoke("group_tasks").then((ts) => {
      const tsks = (ts as SyncTask[]).reduce(
        (acc: SyncTask[], cur: SyncTask) => {
          acc.push({ ...cur, extra_param: integration_extra_param });
          return acc;
        },
        [],
      );
      setTasks(tsks);
    });
  }, [integration_extra_param]);

  const send = (id: string, extraParam: string | null): Promise<void> => {
    console.log("Send task with ID:", id, extraParam);
    return invoke("send_to_integration", {
      id,
      extraParam,
    });
  };

  return { tasks, loadTasks, send };
};

export default useSync;
