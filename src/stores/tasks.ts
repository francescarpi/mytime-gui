import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";
import { dateToStrDate } from "@/utils/dates";
import { useSettingsStore } from "@/stores/settings";

import type { Ref } from "vue";
import type { Task, Project, ExternalID, Summary } from "../types/task";

export const today = new Date().toISOString().split("T")[0];

export const useTasksStore = defineStore("tasks", () => {
  const rawTasks: Ref<Task[]> = ref([]);

  const projects: Ref<Project[]> = ref([]);

  const externalIDs: Ref<ExternalID[]> = ref([]);

  const filterDate: Ref<string> = ref(today);

  const summary: Ref<Summary> = ref({
    today: 0,
    this_week: 0,
    is_running: false,
    pending_sync_tasks: 0,
  });

  const taskToEdit: Ref<Task | null> = ref(null);

  const isRunning = computed(() => {
    return Boolean(rawTasks.value.filter((task) => task.end === null).length);
  });

  const tasks = computed(() => {
    const tasksCopy = [...rawTasks.value];
    const { settings } = useSettingsStore();

    if (settings.view_type === "grouped") {
      tasksCopy.sort((a: Task, b: Task) => {
        let fa = a.desc.toLowerCase(),
          fb = b.desc.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
    }

    return (tasksCopy as Task[]).map((task: Task, index: number) => ({
      ...task,
      number: index <= 8 ? index + 1 : null,
    }));
  });

  const refresh = () => {
    loadTasks();
    loadSummary();
  };

  const loadTasks = async () => {
    return invoke("tasks", { date: filterDate.value }).then(
      (response: unknown) => {
        const tasksJson = JSON.parse(response as string) as Task[];
        rawTasks.value = tasksJson;
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
      refresh();
    }
  };

  const previousFilterDate = () => {
    const date = new Date(filterDate.value);
    date.setDate(date.getDate() - 1);
    filterDate.value = dateToStrDate(date);
    refresh();
  };

  const todayFilterDate = () => {
    filterDate.value = today;
    refresh();
  };

  return {
    isRunning,
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
    todayFilterDate,
    tasks,
  };
});
