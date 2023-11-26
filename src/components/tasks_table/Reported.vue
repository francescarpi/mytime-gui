<script setup lang="ts">
const { task } = defineProps(["task"]);
const { reported } = task;
</script>

<template>
  <q-icon
    :name="reported ? 'cloud_done' : 'cloud'"
    :class="reported ? 'text-black' : 'text-grey-5'"
  ></q-icon>
</template>
