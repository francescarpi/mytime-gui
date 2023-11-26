<script setup lang="ts">
import { useTaskActions } from "./task_actions";

const { task } = defineProps(["task"]);
const { startTask, stopTask, deleteTask, editTask } = useTaskActions();
const emit = defineEmits(["created"]);

const play = () => {
  startTask(task).then(() => {
    emit("created");
  });
};
</script>

<template>
  <q-btn flat icon="delete" round size="sm" color="red" v-if="!task.reported" @click="deleteTask(task)" />
  <q-btn flat icon="edit" round size="sm" color="primary" v-if="!task.reported" @click="editTask(task)" />
  <q-btn flat icon="play_circle" round size="sm" v-if="task.end" color="primary" @click="play" />
  <q-btn flat icon="pause" round size="sm" v-else color="red" @click="stopTask(task.id)" />
</template>
