<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings"
import { useTasksStore } from "@/stores/tasks"
import { storeToRefs } from "pinia"

import type { BtnOption } from "@/types/task"

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const { saveViewType } = settingsStore
const { isSearchEnabled } = storeToRefs(useTasksStore())

const types: BtnOption[] = [
  { label: "Chronological", value: "chronological" },
  { label: "Grouped", value: "grouped" },
]

const change = (value: string) => {
  saveViewType(value)
}
</script>

<template>
  <div id="view_type">
    <q-btn-toggle :options="types" v-model="settings.view_type" rounded size="sm" @update:model-value="change"
      :disable="isSearchEnabled" />
  </div>
</template>
