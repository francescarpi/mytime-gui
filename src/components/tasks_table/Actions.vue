<script setup lang="ts">
import { useTaskActions } from "./task_actions";

const { task, table } = defineProps(["task", "table"]);
const { startTask, stopTask, deleteTask, editTask } = useTaskActions(table);
</script>

<template>
  <q-btn flat icon="delete" round size="sm" color="red" v-if="!task.reported" @click="deleteTask(task)" />
  <q-btn flat icon="edit" round size="sm" color="primary" v-if="!task.reported" @click="editTask(task)" />
  <q-btn flat icon="play_circle" round size="sm" v-if="task.end" color="primary" @click="startTask(task)" />
  <q-btn flat icon="pause" round size="sm" v-else color="red" @click="stopTask(task.id)" />
</template>
