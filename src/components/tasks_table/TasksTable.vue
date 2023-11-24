<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTasksStore, today } from "@/stores/tasks";
import { dateToStrTime, formatDuration, dayOfTheWeek } from "@/utils/dates";
import { pagination } from "@/constants/tables";
import { useNavigation } from "./navigation";
import { useTaskActions } from "./task_actions";
import { useCalendar } from "./calendar";
import { useClipboard } from "./clipboard";
import { useColumns } from "./columns";

import TableViewType from "@/components/TableViewType.vue";

const emit = defineEmits(["click-column"]);
const table = ref();
const { listenKeyDown } = useNavigation(table);
const { startTask, stopTask, deleteTask, editTask } = useTaskActions(table);
const { dateLimits } = useCalendar();
const { copyToClipboard } = useClipboard();
const tasksStore = useTasksStore();
const { nextFilterDate, previousFilterDate, refresh } = tasksStore;
const { tasks, filterDate } = storeToRefs(tasksStore);
const { getColumns } = useColumns();

let interval: number | null = null;

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
</script>

<template>
  <q-table
    title="Tasks"
    :rows="tasks"
    :columns="getColumns()"
    :pagination="pagination"
    row-key="id"
    bordered
    flat
    wrap-cells
    ref="table"
  >
    <template #top-left="">
      <div class="col-2 q-table__title items-center">
        Tasks of day {{ filterDate }} ({{ dayOfTheWeek(new Date(filterDate)) }})
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
    <template #top-right>
      <TableViewType />
    </template>
    <template #header-cell-shortcut>
      <q-th>
        <q-icon name="keyboard_command_key">
          <q-tooltip>Press Alt+number to open task</q-tooltip>
        </q-icon>
      </q-th>
    </template>
    <template #body-cell-project="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.project }}
          <q-btn
            icon="arrow_upward"
            size="xs"
            round
            flat
            @click="emit('click-column', 'project', props.row.project)"
          />
          <q-btn
            icon="file_copy"
            size="xs"
            round
            flat
            @click="copyToClipboard(props.row.project)"
          />
        </div>
      </q-td>
    </template>
    <template #body-cell-description="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.desc }}
          <q-btn
            icon="arrow_upward"
            size="xs"
            round
            flat
            @click="emit('click-column', 'description', props.row.desc)"
          />
          <q-btn
            icon="file_copy"
            size="xs"
            round
            flat
            @click="copyToClipboard(props.row.desc)"
          />
        </div>
      </q-td>
    </template>
    <template #body-cell-external_id="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.external_id }}
          <q-btn
            icon="arrow_upward"
            size="xs"
            round
            flat
            v-if="props.row.external_id"
            @click="emit('click-column', 'external_id', props.row.external_id)"
          />
          <q-btn
            icon="file_copy"
            size="xs"
            round
            flat
            v-if="props.row.external_id"
            @click="copyToClipboard(props.row.external_id)"
          />
        </div>
      </q-td>
    </template>
    <template #body-cell-reported="props">
      <q-td :props="props">
        <q-icon
          :name="props.row.reported ? 'cloud_done' : 'cloud'"
          :class="props.row.reported ? 'text-black' : 'text-grey-5'"
        ></q-icon>
      </q-td>
    </template>
    <template #body-cell-started_at="props">
      <q-td :props="props">
        <span>{{ dateToStrTime(new Date(props.row.start)) }}</span>
      </q-td>
    </template>
    <template #body-cell-ended_at="props">
      <q-td :props="props">
        <span v-if="props.row.end">{{
          dateToStrTime(new Date(props.row.end))
        }}</span>
        <q-icon name="directions_run" v-else size="xs" color="red"></q-icon>
      </q-td>
    </template>
    <template #body-cell-duration="props">
      <q-td :props="props">
        <span>{{ formatDuration(props.row.duration) }}</span>
      </q-td>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          icon="delete"
          round
          size="sm"
          color="red"
          v-if="!props.row.reported"
          @click="deleteTask(props.row)"
        />
        <q-btn
          flat
          icon="edit"
          round
          size="sm"
          color="primary"
          v-if="!props.row.reported"
          @click="editTask(props.row)"
        />
        <q-btn
          flat
          icon="play_circle"
          round
          size="sm"
          v-if="props.row.end"
          color="primary"
          @click="startTask(props.row)"
        />
        <q-btn
          flat
          icon="pause"
          round
          size="sm"
          v-else
          color="red"
          @click="stopTask(props.row.id)"
        />
      </q-td>
    </template>
    <template #body-cell-total_tasks="props">
      <q-td :props="props">
        <q-chip size="sm">{{ props.row.total_tasks }}</q-chip>
      </q-td>
    </template>
    <template #body-cell-actions_grouped="props">
      <q-td :props="props">
        <q-btn
          flat
          icon="play_circle"
          round
          size="sm"
          v-if="!props.row.has_runing_tasks"
          color="primary"
          @click="startTask(props.row)"
        />
        <q-btn
          flat
          icon="pause"
          round
          size="sm"
          v-else
          color="red"
          @click="stopTask(props.row.id)"
        />
      </q-td>
    </template>
  </q-table>
</template>
