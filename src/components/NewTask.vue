<script setup lang="ts">
import { ref, onBeforeUpdate } from "vue"
import { useTasksStore } from "@/stores/tasks"

import type { Ref } from "vue"

const props = defineProps(["initials"])

const tasksStore = useTasksStore()
const { createTask, refresh, setTaskFilterDateToToday } = tasksStore

const description: Ref<string> = ref("")
const project: Ref<string> = ref("")
const externalId: Ref<string> = ref("")
const formEnabled: Ref<boolean> = ref(true)
const form = ref()

onBeforeUpdate(() => {
  switch (props.initials.name) {
    case "description":
      description.value = props.initials.value
      break
    case "project":
      project.value = props.initials.value
      break
    case "external_id":
      externalId.value = props.initials.value
      break
  }
})

const submitHandler = () => {
  formEnabled.value = false
  createTask(project.value, description.value, externalId.value).then(() => {
    setTaskFilterDateToToday()
    refresh()
    formEnabled.value = true
    form.value.reset()
  })
}

const resetHandler = () => {
  project.value = ""
  description.value = ""
  externalId.value = ""
}
</script>

<template>
  <q-form
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
    @submit.prevent="submitHandler"
    @reset="resetHandler"
    ref="form">
    <div class="q-gutter-md row items-start">
      <q-input
        v-model="project"
        filled
        class="col-2"
        label="Project"
        :rules="[(val) => !!val || 'Field is required']"
        :disable="!formEnabled" />
      <q-input
        v-model="description"
        filled
        class="col"
        label="Description"
        :rules="[(val) => !!val || 'Field is required']"
        :disable="!formEnabled" />
      <q-input v-model="externalId" filled label="External ID" :disable="!formEnabled" class="col-2" />
      <q-btn type="reset" size="lg" :disable="!formEnabled" flat>Reset</q-btn>
      <q-btn type="submit" size="lg" color="primary" :disable="!formEnabled">Add</q-btn>
    </div>
  </q-form>
</template>
