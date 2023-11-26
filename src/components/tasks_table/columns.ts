import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import { dateToStrTime, formatDuration } from "@/utils/dates";

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
    style: "width: 130px",
  },
];

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
];

export function useColumns() {
  const { settings } = storeToRefs(useSettingsStore());

  const getColumns = () => {
    return settings.value.view_type === "grouped"
      ? columnsGrouped
      : columnsNotGrouped;
  };

  return {
    getColumns,
  };
}
