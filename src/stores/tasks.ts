import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { invoke } from "@tauri-apps/api"
import { dateToStrDate } from "@/utils/dates"
import { useSettingsStore } from "@/stores/settings"

import type { Ref } from "vue"
import type { Task, Project, ExternalID, Summary, SearchResult } from "../types/task"

export const today = new Date().toISOString().split("T")[0]

export const useTasksStore = defineStore("tasks", () => {
  const rawTasks: Ref<Task[]> = ref([])

  const projects: Ref<Project[]> = ref([])

  const externalIDs: Ref<ExternalID[]> = ref([])

  const filterDate: Ref<string> = ref(today)

  const summary: Ref<Summary> = ref({
    worked_today: 0,
    worked_week: 0,
    worked_month: 0,
    goal_today: 0,
    goal_week: 0,
    is_running: false,
    pending_sync_tasks: 0,
  })

  const taskToEdit: Ref<Task | null> = ref(null)

  const searchQuery: Ref<string> = ref("")
  const searchResult: Ref<Task[]> = ref([])
  const searchTotalWorked: Ref<number> = ref(0)

  const isRunning = computed(() => {
    return Boolean(rawTasks.value.filter((task) => task.end === null).length)
  })

  const addShortcut = (tasks: Task[]) =>
    tasks.map((task, index: number) => ({
      ...task,
      shortcut: index <= 8 ? index + 1 : null,
    }))

  const isSearchEnabled = computed(() => Boolean(searchQuery.value.length))

  const tasks = computed(() => {
    const tasksCopy = [...rawTasks.value]
    const { settings } = useSettingsStore()

    if (isSearchEnabled.value) {
      return addShortcut(searchResult.value)
    }

    if (settings.view_type === "grouped") {
      const grouped: Task[] = tasksCopy.reduce((acc: Task[], task: Task) => {
        let existingTask: Task | undefined = acc.find(
          (t: Task) => t.desc === task.desc && t.project === task.project && t.external_id === task.external_id
        )
        if (existingTask === undefined) {
          acc.push({
            ...task,
            has_runing_tasks: task.end === null,
            children: [task],
          })
        } else {
          existingTask.duration += task.duration
          ;(existingTask.children as Task[]).push(task)
          if (task.end === null) {
            existingTask.has_runing_tasks = true
          }
          if (!task.reported) {
            existingTask.reported = false
          }
        }
        return acc
      }, [])
      return addShortcut(grouped)
    }

    return addShortcut(tasksCopy)
  })

  const refresh = () => {
    loadTasks()
    loadSummary()
  }

  const loadTasks = async () => {
    return invoke("tasks", { date: filterDate.value }).then((response: unknown) => {
      const tasksJson = JSON.parse(response as string) as Task[]
      rawTasks.value = tasksJson
    })
  }

  const createTask = async (project: string, description: string, externalId: string) => {
    searchQuery.value = ""
    return invoke("create_task", { project, description, externalId })
  }

  const loadSummary = async () => {
    return invoke("summary", { date: filterDate.value }).then((response: unknown) => {
      summary.value = JSON.parse(response as string) as Summary
    })
  }

  const setTaskToEdit = (task: Task | null) => {
    taskToEdit.value = task
  }

  const setTaskFilterDateToToday = () => {
    filterDate.value = dateToStrDate(new Date())
  }

  const nextFilterDate = () => {
    if (isSearchEnabled.value) {
      return
    }

    const date = new Date(filterDate.value)
    date.setDate(date.getDate() + 1)
    if (date < new Date()) {
      filterDate.value = dateToStrDate(date)
      refresh()
    }
  }

  const previousFilterDate = () => {
    if (isSearchEnabled.value) {
      return
    }

    const date = new Date(filterDate.value)
    date.setDate(date.getDate() - 1)
    filterDate.value = dateToStrDate(date)
    refresh()
  }

  const todayFilterDate = () => {
    if (isSearchEnabled.value) {
      return
    }

    filterDate.value = today
    refresh()
  }

  const startSearch = () => {
    invoke("search", { query: searchQuery.value }).then((response: unknown) => {
      const result = JSON.parse(response as string) as SearchResult
      searchResult.value = result.tasks
      searchTotalWorked.value = result.total_worked
    })
  }

  const resetSearch = () => {
    searchQuery.value = ""
  }

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
    searchQuery,
    startSearch,
    isSearchEnabled,
    searchResult,
    resetSearch,
    searchTotalWorked,
  }
})
