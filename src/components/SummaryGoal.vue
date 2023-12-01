<script setup lang="ts">
import { formatDuration } from "@/utils/dates"

const { title, value, goal } = defineProps<{
  title: string
  value: number
  goal?: number
}>()

const percent = (value: number, goal: number | undefined): number => {
  if (goal === undefined || goal === 0) {
    return 0
  }
  return value / goal
}

const color = (value: number, goal: number | undefined): string => {
  const per = percent(value, goal)
  return per >= 1 ? "green" : "red"
}
</script>

<template>
  <q-linear-progress size="25px" :value="percent(value, goal)" :color="color(value, goal)" track-color="primary" rounded>
    <div class="absolute-full flex flex-center">
      <q-badge color="white" text-color="black" :label="title + ': ' + formatDuration(value)" outline />
    </div>
  </q-linear-progress>
</template>
