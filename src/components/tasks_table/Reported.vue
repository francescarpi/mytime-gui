<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"
import { storeToRefs } from "pinia"

const { settings } = storeToRefs(useSettingsStore())
const { task } = defineProps(["task"])
const { reported } = task
const color = (reported: boolean, darkMode: boolean) => {
  if (darkMode) {
    return reported ? "text-white" : "text-grey-9"
  }
  return reported ? "text-black" : "text-grey-5"
}
</script>

<template>
  <q-icon :name="reported ? 'cloud_done' : 'cloud'" :class="color(reported, settings?.dark_mode || false)"></q-icon>
</template>
