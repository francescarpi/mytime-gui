<script setup lang="ts">
import TasksTable from "./TasksTable.vue";

const { tasks } = defineProps(["tasks"]);
const emit = defineEmits(["close"]);
</script>

<template>
  <q-dialog :model-value="true" @before-hide="emit('close')">
    <q-card class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6 q-mb-xl">Tasks</div>
        {{ tasks.length }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
