import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/stores/settings"
import { useTasksStore } from "@/stores/tasks"
import { dateToStrTime, formatDuration } from "@/utils/dates"

const columnsNotGrouped: any[] = [
  {
    name: "shortcut",
    align: "center",
    field: "shortcut",
  },
  {
    name: "id",
    label: "#",
    field: "id",
    align: "left",
  },
  {
    name: "project",
    label: "Project",
    field: "project",
    align: "left",
  },
  {
    name: "description",
    label: "Description",
    field: "desc",
    align: "left",
  },
  {
    name: "external_id",
    label: "Ext.ID",
    field: "external_id",
    align: "left",
  },
  {
    name: "started_at",
    label: "Started",
    field: "start",
    align: "center",
    format: (value: string) => dateToStrTime(new Date(value)),
  },
  {
    name: "ended_at",
    label: "Ended",
    field: "end",
    align: "center",
    format: (value: string) => (value ? dateToStrTime(new Date(value)) : "---"),
  },
  {
    name: "duration",
    label: "Duration",
    field: "duration",
    format: (value: number) => formatDuration(value),
    align: "right",
  },
  {
    name: "reported",
    label: "Reported",
    field: "reported",
    align: "center",
  },
  {
    name: "actions",
    label: "Actions",
    style: "width: 150px",
  },
]

const columnsGrouped: any[] = [
  {
    name: "shortcut",
    align: "center",
    field: "shortcut",
  },
  {
    name: "project",
    label: "Project",
    field: "project",
    align: "left",
  },
  {
    name: "description",
    label: "Description",
    field: "desc",
    align: "left",
  },
  {
    name: "external_id",
    label: "Ext.ID",
    field: "external_id",
    align: "left",
  },
  {
    name: "duration",
    label: "Duration",
    field: "duration",
    format: (value: number) => formatDuration(value),
    align: "right",
  },
  {
    name: "reported",
    label: "Reported",
    field: "reported",
    align: "center",
  },
  {
    name: "tasks",
    label: "Tasks",
    align: "center",
  },
  {
    name: "actions_grouped",
    label: "Actions",
    style: "width: 130px",
  },
]

export function useColumns() {
  const { settings } = storeToRefs(useSettingsStore())
  const { isSearchEnabled } = storeToRefs(useTasksStore())

  const getColumns = () =>
    settings.value.view_type === "grouped" && !isSearchEnabled.value ? columnsGrouped : columnsNotGrouped

  return {
    getColumns,
  }
}
