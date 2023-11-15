<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useTasksStore, today } from "@/stores/tasks";
import { invoke } from "@tauri-apps/api";
import { dateToStrTime, formatDuration } from "@/utils/dates";
import { columns } from "@/constants/tasks_table";
import { pagination } from "@/constants/tables";

import type { Task } from "@/types/task";

const emit = defineEmits(["click-column"]);

const tasksStore = useTasksStore();
const {
  createTask,
  setTaskToEdit,
  setTaskFilterDateToToday,
  nextFilterDate,
  previousFilterDate,
  refresh,
} = tasksStore;
const { tasks, filterDate } = storeToRefs(tasksStore);

let interval: number | null = null;

onMounted(() => {
  refresh();

  interval = window.setInterval(() => {
    refresh();
  }, 30000);
});

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
  }
});

const dateLimits = (date: string) => {
  const today = new Date();
  return (
    date <= `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
  );
};

const stopTask = (id: number) => {
  invoke("stop_task", { id }).then(() => {
    refresh();
  });
};

const startTask = (task: Task) => {
  createTask(task.project, task.desc, task.external_id).then(() => {
    setTaskFilterDateToToday();
    refresh();
  });
};

const editHandler = (task: Task) => {
  setTaskToEdit(task);
};
</script>

<template>
  <q-table
    title="Tasks"
    :rows="tasks"
    :columns="columns"
    :pagination="pagination"
    row-key="id"
    bordered
    flat
  >
    <template v-slot:top-left="">
      <div class="col-2 q-table__title items-center">
        Tasks of day {{ filterDate }}
        <q-btn
          icon="arrow_back"
          round
          color="primary"
          size="xs"
          class="q-ml-sm"
          @click="previousFilterDate"
        />
        <q-btn icon="event" round color="primary" size="xs" class="q-mx-sm">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="filterDate"
              mask="YYYY-MM-DD"
              first-day-of-week="1"
              today-btn
              :options="dateLimits"
            >
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn
                  label="OK"
                  color="primary"
                  flat
                  v-close-popup
                  @click="refresh"
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <q-btn
          icon="arrow_forward"
          round
          color="primary"
          size="xs"
          @click="nextFilterDate"
          :disable="filterDate === today"
        />
      </div>
    </template>
    <template v-slot:body-cell-project="props">
      <q-td :props="props" @click="emit('click-column', 'project', props.row.project)">
        {{ props.row.project }}
      </q-td>
    </template>
    <template v-slot:body-cell-description="props">
      <q-td :props="props" @click="emit('click-column', 'description', props.row.desc)">
        {{ props.row.desc }}
      </q-td>
    </template>
    <template v-slot:body-cell-external_id="props">
      <q-td :props="props" @click="emit('click-column', 'external_id', props.row.external_id)">
        {{ props.row.external_id }}
      </q-td>
    </template>
    <template v-slot:body-cell-reported="props">
      <q-td :props="props">
        <q-icon
          name="radio_button_checked"
          :class="props.row.reported ? 'text-green' : 'text-red'"
        ></q-icon>
      </q-td>
    </template>
    <template v-slot:body-cell-started_at="props">
      <q-td :props="props">
        <span>{{ dateToStrTime(new Date(props.row.start)) }}</span>
      </q-td>
    </template>
    <template v-slot:body-cell-ended_at="props">
      <q-td :props="props">
        <span v-if="props.row.end">{{
          dateToStrTime(new Date(props.row.end))
        }}</span>
        <q-icon name="directions_run" v-else size="xs" color="red"></q-icon>
      </q-td>
    </template>
    <template v-slot:body-cell-duration="props">
      <q-td :props="props">
        <span>{{ formatDuration(props.row.duration) }}</span>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          icon="edit"
          round
          size="xs"
          color="secondary"
          v-if="!props.row.reported"
          @click="editHandler(props.row)"
        />
        <q-btn
          flat
          icon="play_circle"
          round
          size="xs"
          v-if="props.row.end"
          color="primary"
          @click="startTask(props.row)"
        />
        <q-btn
          flat
          icon="pause"
          round
          size="xs"
          v-else
          color="primary"
          @click="stopTask(props.row.id)"
        />
      </q-td>
    </template>
  </q-table>
</template>
