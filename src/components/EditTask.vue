<script setup lang="ts">
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useTasksStore } from "@/stores/tasks"
import { dateToStrTime, hourToSeconds } from "@/utils/dates"
import { invoke } from "@tauri-apps/api"

import type { Task } from "@/types/task"

const tasksStore = useTasksStore()
const { setTaskToEdit, refresh } = tasksStore
const { taskToEdit } = storeToRefs(tasksStore)

const project = ref("")
const description = ref("")
const externalId = ref("")
const start = ref("")
const end = ref("")

const cancel = () => {
  setTaskToEdit(null)
}

const beforeShow = () => {
  const task: Task = taskToEdit.value as Task

  project.value = task.project
  description.value = task.desc
  externalId.value = task.external_id
  start.value = dateToStrTime(new Date(task.start))
  end.value = task.end ? dateToStrTime(new Date(task.end)) : ""
}

const startIsValid = (startHour: String, endHour: String | null | undefined) =>
  endHour === null || hourToSeconds(startHour) < hourToSeconds(end.value)
const endIsValid = (endHour: String) => hourToSeconds(endHour) > hourToSeconds(start.value)

const save = () => {
  const task: Task = taskToEdit.value as Task
  const payload = {
    id: task.id,
    project: project.value,
    desc: description.value,
    externalId: externalId.value,
    start: start.value,
    end: end.value || null,
  }
  invoke("edit_task", payload).then(() => {
    refresh()
    setTaskToEdit(null)
  })
}
</script>

<template>
  <q-dialog :model-value="Boolean(taskToEdit)" @before-show="beforeShow" full-width @before-hide="cancel">
    <q-card class="q-px-sm q-pb-md">
      <q-form @submit.prevent="save" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
        <q-card-section>
          <div class="text-h6 q-mb-xl">Task edition</div>
          <div class="row q-gutter-md">
            <q-input
              v-model="project"
              filled
              class="col-2"
              label="Project"
              :rules="[(val) => !!val || 'Field is required']" />
            <q-input
              v-model="description"
              filled
              class="col"
              label="Description"
              :rules="[(val) => !!val || 'Field is required']" />
            <q-input v-model="externalId" filled label="External ID" class="col" />
          </div>

          <div class="row q-gutter-md">
            <q-input
              filled
              v-model="start"
              label="Start"
              readonly
              :rules="[(val) => startIsValid(val, taskToEdit?.end) || 'It must be less than the end']">
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

            <q-input
              filled
              v-model="end"
              label="End"
              readonly
              v-if="Boolean(taskToEdit?.end)"
              :rules="[(val) => endIsValid(val) || 'It must be greater than the start']">
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
            <q-btn type="submit" icon="save" color="primary">Save</q-btn>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
