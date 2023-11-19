import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";
import { dateToStrDate } from "@/utils/dates";

import type { Ref } from "vue";
import type { Task, Project, ExternalID, Summary } from "../types/task";

export const today = new Date().toISOString().split("T")[0];

export const useTasksStore = defineStore("tasks", () => {
  const tasks: Ref<Task[]> = ref([]);

  const projects: Ref<Project[]> = ref([]);

  const externalIDs: Ref<ExternalID[]> = ref([]);

  const filterDate: Ref<string> = ref(today);

  const summary: Ref<Summary> = ref({ today: 0, this_week: 0, is_running: false, pending_sync_tasks: 0 });

  const taskToEdit: Ref<Task | null> = ref(null);

  const isRunning = computed(() => {
    return Boolean(tasks.value.filter((task) => task.end === null).length);
  });

  const loadTasks = async () => {
    return invoke("tasks", { date: filterDate.value }).then(
      (response: unknown) => {
        const tasksJson = JSON.parse(response as string) as Task[];
        tasks.value = tasksJson;
      },
    );
  };

  const createTask = (
    project: string,
    description: string,
    externalId: string,
  ) => {
    return invoke("create_task", { project, description, externalId });
  };

  const loadSummary = async () => {
    return invoke("summary", { date: filterDate.value }).then(
      (response: unknown) => {
        summary.value = JSON.parse(response as string) as Summary;
      },
    );
  };

  const setTaskToEdit = (task: Task | null) => {
    taskToEdit.value = task;
  };

  const setTaskFilterDateToToday = () => {
    filterDate.value = dateToStrDate(new Date());
  };

  const nextFilterDate = () => {
    const date = new Date(filterDate.value);
    date.setDate(date.getDate() + 1);
    if (date < new Date()) {
      filterDate.value = dateToStrDate(date);
      loadTasks();
      loadSummary();
    }
  };

  const previousFilterDate = () => {
    const date = new Date(filterDate.value);
    date.setDate(date.getDate() - 1);
    filterDate.value = dateToStrDate(date);
    loadTasks();
    loadSummary();
  };

  const refresh = () => {
    loadTasks();
    loadSummary();
  }

  return {
    isRunning,
    tasks,
    projects,
    externalIDs,
    loadTasks,
    createTask,
    filterDate,
    summary,
    loadSummary,
    taskToEdit,
    setTaskToEdit,
    setTaskFilterDateToToday,
    nextFilterDate,
    previousFilterDate,
    refresh,
  };
});
