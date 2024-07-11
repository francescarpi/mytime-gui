import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface SyncTask {
  id: string;
  date: string;
  desc: string;
  project: string;
  duration: number;
  external_id: string;
  ids: number[];
  extra_param: string | null;
}

const useSync = () => {
  const [tasks, setTasks] = useState<SyncTask[]>([]);

  const loadTasks = useCallback(() => {
    invoke("group_tasks").then((ts) => {
      const tsks = (ts as SyncTask[]).reduce(
        (acc: SyncTask[], cur: SyncTask) => {
          acc.push({ ...cur, extra_param: null });
          return acc;
        },
        [],
      );
      setTasks(tsks);
    });
  }, []);

  const send = (
    taskId: string,
    integrationId: number,
    externalId: string,
  ): Promise<void> => {
    console.log("Send task with data:", taskId, integrationId, externalId);
    return invoke("send_to_integration", {
      taskId,
      integrationId,
      externalId,
    });
  };

  const updateTaskExtraParam = (id: string, extraParam: string | null) => {
    const newTasks = [...tasks];
    const taskFound = newTasks.find((t) => t.id === id) as SyncTask;
    taskFound.extra_param = extraParam;
    setTasks(newTasks);
  };

  return { tasks, loadTasks, send, updateTaskExtraParam };
};

export default useSync;
