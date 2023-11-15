<script setup lang="ts">
import { ref } from "vue";
import { useTasksStore } from "@/stores/tasks";

import type { Ref } from "vue";

const tasksStore = useTasksStore();
const { createTask, loadTasks } = tasksStore;

const description: Ref<string> = ref("");
const project: Ref<string> = ref("");
const externalId: Ref<string> = ref("");
const formEnabled: Ref<boolean> = ref(true);
const form = ref();

const submitHandler = () => {
  formEnabled.value = false;
  createTask(project.value, description.value, externalId.value).then(() => {
    loadTasks().then(() => {
      formEnabled.value = true;
      form.value.reset();
    });
  });
};

const resetHandler = () => {
  project.value = "";
  description.value = "";
  externalId.value = "";
};
</script>

<template>
  <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" @submit.prevent="submitHandler"
    @reset="resetHandler" ref="form">
    <div class="q-gutter-md row items-start">
      <q-input v-model="project" filled class="col-2" label="Project" :rules="[(val) => !!val || 'Field is required']"
        :disable="!formEnabled" />
      <q-input v-model="description" filled class="col" label="Description"
        :rules="[(val) => !!val || 'Field is required']" :disable="!formEnabled" />
      <q-input v-model="externalId" filled label="External ID" :disable="!formEnabled" class="col-2" />
      <q-btn type="submit" size="lg" color="primary" :disable="!formEnabled">Add</q-btn>
    </div>
  </q-form>
</template>
