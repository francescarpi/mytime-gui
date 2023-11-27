<script setup lang="ts">
import { formatDuration } from "@/utils/dates";

const { title, value, goal } = defineProps<{
  title: string;
  value: number;
  goal?: number;
}>();

</script>

<template>
  <div>
    {{ title }}:
    <span class="text-bold q-pl-xs" :class="!goal ? '' : value - goal < 0 ? 'text-red-7' : 'text-green-8'">
      {{ formatDuration(value) }}
    </span>
  </div>
</template>
