import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Integration } from "./useSettings";

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

export interface IntegrationLog {
  external_id: string;
  integration_id: number;
  task_id: string;
  status: string;
  log: string;
}

const useSync = (activeIntegrations: Integration[]) => {
  const [tasks, setTasks] = useState<SyncTask[]>([]);
  const [integrationLogs, setIntegrationLogs] = useState<IntegrationLog[]>([]);

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

  const loadTasksData = useCallback(() => {
    tasks.forEach((task) =>
      activeIntegrations.forEach((integration) => {
        invoke("integration_log", {
          taskId: task.id,
          integrationId: integration.id,
        }).then((resp) => {
          console.log(resp);
        });
        console.log("Load task data for task:", task.id, integration.id);
      }),
    );
  }, [tasks, activeIntegrations]);

  return { tasks, loadTasks, send, updateTaskExtraParam, loadTasksData };
};

export default useSync;
