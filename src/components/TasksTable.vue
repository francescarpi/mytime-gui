<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTasksStore, today } from "@/stores/tasks";
import { invoke } from "@tauri-apps/api";
import { dateToStrTime, formatDuration, dayOfTheWeek } from "@/utils/dates";
import { columns } from "@/constants/tasks_table";
import { pagination } from "@/constants/tables";
import { useQuasar } from "quasar";

import type { Task } from "@/types/task";

const emit = defineEmits(["click-column"]);
const $q = useQuasar();
const table = ref();

const tasksStore = useTasksStore();
const {
  createTask,
  setTaskToEdit,
  setTaskFilterDateToToday,
  nextFilterDate,
  previousFilterDate,
  refresh,
  todayFilterDate,
} = tasksStore;
const { tasksWithCounter, filterDate } = storeToRefs(tasksStore);

let interval: number | null = null;

const listenKeyDown = (e: KeyboardEvent) => {
  switch (e.code) {
    case "ArrowLeft":
      previousFilterDate();
      break;
    case "ArrowRight":
      nextFilterDate();
      break;
    case "ArrowDown":
      todayFilterDate();
      break;
    case "Digit1":
      openTaskNumber(1);
      break;
    case "Digit2":
      openTaskNumber(2);
      break;
    case "Digit3":
      openTaskNumber(3);
      break;
    case "Digit4":
      openTaskNumber(4);
      break;
    case "Digit5":
      openTaskNumber(5);
      break;
    case "Digit6":
      openTaskNumber(6);
      break;
    case "Digit7":
      openTaskNumber(7);
      break;
    case "Digit8":
      openTaskNumber(8);
      break;
    case "Digit9":
      openTaskNumber(9);
      break;
  }
};

onMounted(() => {
  refresh();

  interval = window.setInterval(() => {
    refresh();
  }, 30000);

  window.addEventListener("keydown", listenKeyDown);
});

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
  }
  window.removeEventListener("keydown", listenKeyDown);
});

const openTaskNumber = (num: number) => {
  const task: Task | undefined = tasksWithCounter.value.find(
    (task: Task) => task.number === num,
  );
  if (task !== undefined) {
    startTask(task);
  }
};

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
    table.value.firstPage();
    refresh();
  });
};

const editHandler = (task: Task) => {
  setTaskToEdit(task);
};

const deleteHandler = (task: Task) => {
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

const copyToClipboard = (content: string) => {
  navigator.clipboard.writeText(content);
  $q.notify({
    message: "Copied to clipboard",
    position: "top",
  });
};
</script>

<template>
  <q-table title="Tasks" :rows="tasksWithCounter" :columns="columns" :pagination="pagination" row-key="id" bordered flat
    wrap-cells ref="table">
    <template v-slot:top-left="">
      <div class="col-2 q-table__title items-center">
        Tasks of day {{ filterDate }} ({{ dayOfTheWeek(new Date(filterDate)) }})
        <q-btn icon="arrow_back" round color="primary" size="xs" class="q-ml-sm" @click="previousFilterDate" />
        <q-btn icon="event" round color="primary" size="xs" class="q-mx-sm">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="filterDate" mask="YYYY-MM-DD" first-day-of-week="1" today-btn :options="dateLimits">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat v-close-popup @click="refresh" />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <q-btn icon="arrow_forward" round color="primary" size="xs" @click="nextFilterDate"
          :disable="filterDate === today" />
      </div>
    </template>
    <template #header-cell-shortcut>
      <q-th>
        <q-icon name="keyboard_command_key">
          <q-tooltip>Press Alt+number to open task</q-tooltip>
        </q-icon>
      </q-th>
    </template>
    <template v-slot:body-cell-project="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.project }}
          <q-btn icon="arrow_upward" size="xs" round flat @click="emit('click-column', 'project', props.row.project)" />
          <q-btn icon="file_copy" size="xs" round flat @click="copyToClipboard(props.row.project)" />
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-description="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.desc }}
          <q-btn icon="arrow_upward" size="xs" round flat @click="emit('click-column', 'description', props.row.desc)" />
          <q-btn icon="file_copy" size="xs" round flat @click="copyToClipboard(props.row.desc)" />
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-external_id="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.external_id }}
          <q-btn icon="arrow_upward" size="xs" round flat v-if="props.row.external_id"
            @click="emit('click-column', 'external_id', props.row.external_id)" />
          <q-btn icon="file_copy" size="xs" round flat v-if="props.row.external_id"
            @click="copyToClipboard(props.row.external_id)" />
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-reported="props">
      <q-td :props="props">
        <q-icon :name="props.row.reported ? 'cloud_done' : 'cloud'"
          :class="props.row.reported ? 'text-black' : 'text-grey-5'"></q-icon>
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
        <q-btn flat icon="delete" round size="sm" color="red" v-if="!props.row.reported"
          @click="deleteHandler(props.row)" />
        <q-btn flat icon="edit" round size="sm" color="primary" v-if="!props.row.reported"
          @click="editHandler(props.row)" />
        <q-btn flat icon="play_circle" round size="sm" v-if="props.row.end" color="primary"
          @click="startTask(props.row)" />
        <q-btn flat icon="pause" round size="sm" v-else color="red" @click="stopTask(props.row.id)" />
      </q-td>
    </template>
  </q-table>
</template>
