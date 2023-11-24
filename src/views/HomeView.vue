<script setup lang="ts">
import { ref } from "vue";
import TasksTable from "@/components/TasksTable.vue";
import NewTask from "@/components/NewTask.vue";
import EditTask from "@/components/EditTask.vue";
// import TasksTableGrouped from "@/components/TasksTableGrouped.vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";

import type { Ref } from "vue";

const newTaskInitials: Ref<any> = ref(null);
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const clickColumnHandler = (name: string, value: string) => {
  newTaskInitials.value = { name, value };
};
</script>

<template>
  <main>
    <EditTask />
    <NewTask class="q-mb-xs" :initials="newTaskInitials" />
    <TasksTable @click-column="clickColumnHandler" v-if="settings.view_type === 'chronological'" />
    <!-- <TasksTableGrouped v-else /> -->
  </main>
</template>
