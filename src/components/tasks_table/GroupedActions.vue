<script setup lang="ts">
import { useTaskActions } from "./task_actions";

const { task } = defineProps(["task"]);
const { startTask, stopTask } = useTaskActions();
const emit = defineEmits(["created"]);

const play = () => {
  startTask(task).then(() => {
    emit("created");
  });
};
</script>

<template>
  <q-btn flat icon="play_circle" round size="sm" v-if="!task.has_runing_tasks" color="primary" @click="play" />
  <q-btn flat icon="pause" round size="sm" v-else color="red" @click="stopTask(task.id)" />
</template>
