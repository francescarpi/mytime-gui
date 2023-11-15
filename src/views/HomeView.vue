<script setup lang="ts">
import { ref } from "vue";
import TasksTable from "@/components/TasksTable.vue";
import NewTask from "@/components/NewTask.vue";
import EditTask from "@/components/EditTask.vue";

import type { Ref } from "vue";

const newTaskInitials: Ref<any> = ref(null);

const clickColumnHandler = (name: string, value: string) => {
  newTaskInitials.value = { name, value };
};
</script>

<template>
  <main>
    <EditTask />
    <NewTask class="q-mb-xs" :initials="newTaskInitials" />
    <TasksTable @click-column="clickColumnHandler" />
  </main>
</template>
