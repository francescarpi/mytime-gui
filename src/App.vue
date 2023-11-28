<script setup lang="ts">
import { RouterView } from "vue-router"
import { invoke } from "@tauri-apps/api"
import { getVersion } from "@tauri-apps/api/app"
import { ref, onMounted } from "vue"
import { storeToRefs } from "pinia"
import { useTasksStore } from "@/stores/tasks"
import { useSettingsStore } from "@/stores/settings"
import { useQuasar } from "quasar"
import Settings from "@/components/Settings.vue"
import Sync from "@/components/Sync.vue"
import SummaryGoal from "@/components/SummaryGoal.vue"

import type { Ref } from "vue"

const $q = useQuasar()
const configReady: Ref<unknown> = ref(false)
const showSettings: Ref<boolean> = ref(false)
const showSync: Ref<boolean> = ref(false)
const darkMode: Ref<boolean> = ref(false)

const tasksStore = useTasksStore()
const { summary, searchQuery } = storeToRefs(tasksStore)
const { startSearch } = tasksStore

const settingsStore = useSettingsStore()
const { isValid, settings } = storeToRefs(settingsStore)
const { load, saveDarkMode } = settingsStore

onMounted(() => {
  getVersion().then((version) => {
    invoke("init", { version }).then(() => {
      configReady.value = true

      load().then(() => {
        darkMode.value = settings.value.dark_mode
        $q.dark.set(darkMode.value)
      })
    })
  })
})

const setDarkMode = () => {
  $q.dark.set(darkMode.value)
  saveDarkMode(darkMode.value)
}
</script>

<template>
  <q-layout view="hHh lpr fFf" v-if="configReady">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <q-icon name="timer" />
        </q-avatar>
        <q-toolbar-title> MyTime </q-toolbar-title>
        <q-input dark dense standout v-model="searchQuery" class="q-mr-xl" @update:model-value="startSearch">
          <template v-slot:append>
            <q-icon v-if="searchQuery === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchQuery = ''" />
          </template>
        </q-input>
        <q-chip color="red" text-color="white" icon="directions_run" v-if="summary.is_running" class="q-mr-xl">
          Running
        </q-chip>
        <q-chip color="green" text-color="white" icon="local_cafe" v-else class="q-mr-xl">Stopped</q-chip>
        <q-btn flat round dense icon="cloud_upload" @click="showSync = true" v-if="isValid" class="q-mr-md">
          <q-badge color="red" floating rounded v-if="summary.pending_sync_tasks > 0">
            {{ summary.pending_sync_tasks }}
          </q-badge>
        </q-btn>
        <q-btn flat round dense icon="settings" @click="showSettings = true" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-md">
        <router-view />
      </div>
    </q-page-container>

    <q-footer bordered class="bg-grey-4 text-black">
      <q-toolbar>
        <div class="row q-gutter-md full-width">
          <SummaryGoal title="Worked on date" :value="summary.worked_today" :goal="summary.goal_today" />
          <SummaryGoal title="Worked on date's week" :value="summary.worked_week" :goal="summary.goal_week" />
          <SummaryGoal title="Worked on date's month" :value="summary.worked_month" />
        </div>
        <q-toggle v-model="darkMode" icon="dark_mode" @update:model-value="setDarkMode" />
      </q-toolbar>
    </q-footer>
  </q-layout>
  <div v-else class="row justify-center q-pa-xl">
    <span>Loading...</span>
  </div>
  <Settings :show="showSettings" @close="showSettings = false" />
  <Sync :show="showSync" @close="showSync = false" />
</template>
