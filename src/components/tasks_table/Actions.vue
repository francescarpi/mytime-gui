<script setup lang="ts">
import { useTaskActions } from "./task_actions";
import BasicActions from "./BasicActions.vue";

import type { Task } from "@/types/task";

const { task } = defineProps<{ task: Task }>();
const { startTask, stopTask } = useTaskActions();
const emit = defineEmits(["created"]);

const play = () => {
  startTask(task).then(() => {
    emit("created");
  });
};
</script>

<template>
  <BasicActions :task="task" />
  <q-btn
    flat
    icon="play_circle"
    round
    size="sm"
    v-if="task.end"
    color="primary"
    @click="play"
  />
  <q-btn
    flat
    icon="pause"
    round
    size="sm"
    v-else
    color="red"
    @click="stopTask(task.id)"
  />
</template>
