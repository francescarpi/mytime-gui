import { useTasksStore } from "@/stores/tasks";
import { invoke } from "@tauri-apps/api";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";

import type { Task } from "@/types/task";

export function useTaskActions() {
  const tasksStore = useTasksStore();
  const { createTask, setTaskFilterDateToToday, refresh, setTaskToEdit } =
    tasksStore;
  const { tasks } = storeToRefs(tasksStore);
  const $q = useQuasar();

  const openTaskNumber = (num: number) => {
    const task: Task | undefined = tasks.value.find(
      (task: Task) => task.shortcut === num,
    );
    if (task !== undefined) {
      startTask(task);
    }
  };

  const startTask = async (task: Task) => {
    return createTask(task.project, task.desc, task.external_id).then(() => {
      setTaskFilterDateToToday();
      refresh();
    });
  };

  const stopTask = (id: number) => {
    invoke("stop_task", { id }).then(() => {
      refresh();
    });
  };

  const deleteTask = (task: Task) => {
    $q.dialog({
      title: "Delete task",
      message: `Would you like to delete the task ${task.id}?`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      invoke("delete_task", { id: task.id }).then(() => {
        refresh();
        $q.notify({
          message: "Task deleted successfully",
          position: "top",
        });
      });
    });
  };

  const editTask = (task: Task) => {
    setTaskToEdit(task);
  };

  return {
    openTaskNumber,
    startTask,
    stopTask,
    deleteTask,
    editTask,
  };
}
