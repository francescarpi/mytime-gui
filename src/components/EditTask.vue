<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTasksStore } from "@/stores/tasks";
import { dateToStrTime } from "@/utils/dates";
import { invoke } from "@tauri-apps/api";

import type { Task } from "@/types/task";

const tasksStore = useTasksStore();
const { setTaskToEdit, loadTasks, loadSummary } = tasksStore;
const { taskToEdit } = storeToRefs(tasksStore);

const project = ref("");
const description = ref("");
const externalId = ref("");
const start = ref("");
const end = ref("");

const cancel = () => {
  setTaskToEdit(null);
};

const beforeShow = () => {
  const task: Task = taskToEdit.value as Task;

  project.value = task.project;
  description.value = task.desc;
  externalId.value = task.external_id;
  start.value = dateToStrTime(new Date(task.start));
  end.value = task.end ? dateToStrTime(new Date(task.end)) : "";
};

const save = () => {
  const task: Task = taskToEdit.value as Task;
  invoke("edit_task", {
    id: task.id,
    project: project.value,
    desc: description.value,
    externalId: externalId.value,
    start: start.value,
    end: end.value,
  }).then(() => {
    loadTasks();
    loadSummary();
    setTaskToEdit(null);
  });
};
</script>

<template>
  <q-dialog :model-value="Boolean(taskToEdit)" @before-show="beforeShow" full-width @before-hide="cancel">
    <q-card class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6 q-mb-xl">Task edition</div>
        <div class="row q-gutter-md">
          <q-input v-model="project" filled class="col-2" label="Project"
            :rules="[(val) => !!val || 'Field is required']" />
          <q-input v-model="description" filled class="col" label="Description"
            :rules="[(val) => !!val || 'Field is required']" />
          <q-input v-model="externalId" filled label="External ID" class="col" />
        </div>

        <div class="row q-gutter-md">
          <q-input filled v-model="start" label="Start" readonly>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="start" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input filled v-model="end" label="End" readonly v-if="Boolean(taskToEdit?.end)">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="end" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="row q-gutter-md justify-end">
          <q-btn type="button" icon="cancel" color="red" @click="cancel">Cancel</q-btn>
          <q-btn type="submit" icon="save" color="primary" @click="save">Save</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
