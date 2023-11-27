<script setup lang="ts">
import { computed } from "vue";
import { formatDuration } from "@/utils/dates";

const { title, value, goal } = defineProps<{
  title: string;
  value: number;
  goal?: number;
}>();

const className = computed(() => {
  if (!goal) {
    return "";
  }

  return value - goal < 0 ? "text-red-7" : "text-green-8";
});

</script>

<template>
  <div>
    {{ title }}:
    <span class="text-bold q-pl-xs" :class="className">
      {{ formatDuration(value) }}
    </span>
  </div>
</template>
