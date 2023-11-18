import type { IntegrationTask } from "@/types/integration";

export const columns: any[] = [
  {
    name: "desc",
    label: "Description",
    field: "desc",
    align: "left",
  },
  {
    name: "date",
    label: "Date",
    field: "date",
    align: "left",
  },
  {
    name: "duration",
    label: "Duration",
    field: "duration",
  },
  {
    name: "external_id",
    label: "Ext.ID",
    field: "external_id",
  },
  {
    name: "ids",
    label: "Task Ids",
    field: "ids",
    format: (val: string[], _: IntegrationTask) => val.join(", "),
  },
  {
    name: "status",
    label: "Status",
    align: "center",
  },
];
