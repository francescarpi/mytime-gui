<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, nextTick } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useIntegrationStore } from "@/stores/integration";
import { useTasksStore } from "@/stores/tasks";
import { getIntegration } from "@/utils/settings";
import { formatDuration } from "@/utils/dates";
import { pagination } from "@/constants/tables";
import { columns } from "@/constants/sync";

import type { Ref } from "vue";
import type { Option } from "@/types/settings";
import type { IntegrationTask } from "@/types/integration";

const tasks: Ref<IntegrationTask[]> = ref([]);
const isSending: Ref<boolean> = ref(false);
const tasksDone: Ref<string[]> = ref([]);
const tasksWithError: Ref<string[]> = ref([]);
const finished: Ref<boolean> = ref(false);
const totalDuration: Ref<number> = ref(0);

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const integrationStore = useIntegrationStore();
const { groupTasks, sendToIntegration } = integrationStore;

const tasksStore = useTasksStore();
const { refresh } = tasksStore;

const emit = defineEmits(["close"]);
const props = defineProps({
  show: Boolean,
});
const beforeClose = () => {
  emit("close");
};
const beforeShow = () => {
  tasksDone.value = [];
  tasksWithError.value = [];
  finished.value = false;
  groupTasks().then((tsks: IntegrationTask[]) => {
    tasks.value = tsks;
    totalDuration.value = tsks.reduce((acc, obj) => acc + obj.duration, 0);
  });
};

const sendHandler = () => {
  isSending.value = true;
  nextTick(() => {
    const promises: any[] = [];
    tasks.value.forEach((task) => {
      promises.push(
        sendToIntegration(
          task.desc,
          task.date,
          formatDuration(task.duration),
          task.external_id,
          task.ids,
        )
          .then(() => {
            tasksDone.value.push(task.external_id);
          })
          .catch(() => {
            tasksWithError.value.push(task.external_id);
          }),
      );
    });

    Promise.all(promises).then(() => {
      isSending.value = false;
      finished.value = true;
      refresh();
    });
  });
};
</script>

<template>
  <q-dialog
    :model-value="props.show"
    :persistent="isSending"
    @before-hide="beforeClose"
    @before-show="beforeShow"
    full-width
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          Sync with
          {{ (getIntegration(settings.integration) as Option).label }} ({{
            formatDuration(totalDuration)
          }})
        </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          :disable="isSending"
        />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-table
          :columns="columns"
          :rows="tasks"
          :pagination="pagination"
          row-key="external_id"
          bordered
          flat
        >
          <template v-slot:body-cell-duration="props">
            <q-td :props="props">
              <span>{{ formatDuration(props.row.duration) }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-icon
                name="warning"
                v-if="tasksWithError.includes(props.row.external_id)"
                color="red"
              >
                <q-tooltip
                  >Error sending task. Please, check its external id.</q-tooltip
                >
              </q-icon>
              <div v-else>
                <q-icon
                  name="check_box"
                  v-if="tasksDone.includes(props.row.external_id)"
                />
                <q-icon name="check_box_outline_blank" v-else />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section class="row q-gutter-md justify-end">
        <q-btn
          color="primary"
          @click="sendHandler"
          :disable="isSending"
          :loading="isSending"
          v-if="!finished && tasks.length"
          >Send to
          {{ (getIntegration(settings.integration) as Option).label }}</q-btn
        >
        <q-btn
          color="primary"
          @click="beforeClose"
          v-if="finished || tasks.length === 0"
          >Close</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
