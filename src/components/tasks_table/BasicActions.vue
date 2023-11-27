<script setup lang="ts">
import { useTaskActions } from "./task_actions";
import type { Task } from "@/types/task";

const { task } = defineProps<{ task: Task }>();
const { deleteTask, editTask } = useTaskActions();
</script>

<template>
  <q-btn
    flat
    icon="delete"
    round
    size="sm"
    color="red"
    v-if="!task.reported"
    @click="deleteTask(task)"
  />
  <q-btn
    flat
    icon="edit"
    round
    size="sm"
    color="primary"
    v-if="!task.reported"
    @click="editTask(task)"
  />
</template>
