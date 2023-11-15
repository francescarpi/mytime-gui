<script setup lang="ts">
import TasksTable from "@/components/TasksTable.vue";
import NewTask from "@/components/NewTask.vue";
import EditTask from "@/components/EditTask.vue";
</script>

<template>
  <main>
    <EditTask />
    <NewTask class="q-mb-xs" />
    <TasksTable />
  </main>
</template>
