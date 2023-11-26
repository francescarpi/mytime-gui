<script setup lang="ts">
import { useTaskActions } from "./task_actions";

const { task, table } = defineProps(["task", "table"]);
const { startTask, stopTask } = useTaskActions(table);
</script>

<template>
  <q-btn flat icon="play_circle" round size="sm" v-if="!task.has_runing_tasks" color="primary" @click="startTask(task)" />
  <q-btn flat icon="pause" round size="sm" v-else color="red" @click="stopTask(task.id)" />
</template>
