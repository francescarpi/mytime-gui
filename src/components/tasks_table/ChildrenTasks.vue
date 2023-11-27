<script setup lang="ts">
import { ref } from "vue";
import { pagination } from "@/constants/tables";
import { dateToStrTime, formatDuration } from "@/utils/dates";
import Reported from "./Reported.vue";
import BasicActions from "./BasicActions.vue";

import type { Ref } from "vue";

const { task } = defineProps(["task"]);
const show: Ref<boolean> = ref(false);

const toggle = () => {
  show.value = !show.value;
};

const columns: any[] = [
  {
    name: "id",
    label: "#",
    field: "id",
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
</script>

<template>
  <q-btn size="xs" round color="primary" unelevated dense @click="toggle">
    {{ task.children.length }}
  </q-btn>
  <q-dialog :model-value="show">
    <q-card class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6 q-mb-xl">
          [{{ task.project }}] {{ task.desc }} ({{ task.external_id }})
        </div>
        <q-table :rows="task.children" :columns="columns" :pagination="pagination" row-key="id" bordered flat wrap-cells>
          <template #body-cell-reported="props">
            <q-td :props="props">
              <Reported :task="props.row" />
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <BasicActions :task="props.row" />
            </q-td>
          </template>
        </q-table>
        <div class="row q-gutter-md justify-end q-mt-md">
          <q-btn type="button" color="primary" @click="toggle">Close</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
