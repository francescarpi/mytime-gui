<script setup lang="ts">
import { RouterView } from "vue-router"
import { invoke } from "@tauri-apps/api"
import { getVersion } from "@tauri-apps/api/app"
import { ref, onMounted, onBeforeUnmount } from "vue"
import { storeToRefs } from "pinia"
import { useTasksStore } from "@/stores/tasks"
import { useSettingsStore } from "@/stores/settings"
import { useQuasar } from "quasar"
import { formatDuration } from "@/utils/dates"
import Settings from "@/components/Settings.vue"
import Sync from "@/components/Sync.vue"
import SummaryGoal from "@/components/SummaryGoal.vue"
import { tour } from "@/utils/tour"

import type { InputHTMLAttributes, Ref } from "vue"

const $q = useQuasar()
const configReady: Ref<unknown> = ref(false)
const showSettings: Ref<boolean> = ref(false)
const showSync: Ref<boolean> = ref(false)
const darkMode: Ref<boolean> = ref(false)

const tasksStore = useTasksStore()
const { summary, searchQuery } = storeToRefs(tasksStore)
const { startSearch, resetSearch } = tasksStore

const settingsStore = useSettingsStore()
const { isValid, settings } = storeToRefs(settingsStore)
const { load, saveDarkMode } = settingsStore

const searchInput = ref(null)

const listenKeysPressed = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "f") {
    if (searchInput.value) {
      ;(searchInput.value as HTMLElement).focus()
    }
  } else if (e.key === "Escape") {
    if (e.target && (e.target as InputHTMLAttributes).name === "search") {
      ;(e.target as HTMLElement).dispatchEvent(new CustomEvent("blur-search"))
      ;(e.target as HTMLElement).blur()
    }
  }
}

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
  window.addEventListener("keydown", listenKeysPressed)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", listenKeysPressed)
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
        <div id="search_field">
          <q-input
            dark
            dense
            standout
            v-model="searchQuery"
            class="q-mr-xl"
            @update:model-value="startSearch"
            ref="searchInput"
            name="search"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            @blur-search="resetSearch">
            <template v-slot:append>
              <q-icon v-if="searchQuery === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="searchQuery = ''" />
            </template>
          </q-input>
        </div>
        <div id="task_status">
          <q-chip color="red" text-color="white" v-if="summary.is_running" class="q-mr-xl" icon="timer"> On </q-chip>
          <q-chip color="green" text-color="white" icon="timer_off" v-else class="q-mr-xl">Off</q-chip>
        </div>
        <q-btn flat round dense icon="help" @click="tour.start()" class="q-mr-md" v-if="!settings.tour_completed" />
        <q-btn
          flat
          round
          dense
          icon="cloud_upload"
          @click="showSync = true"
          v-if="isValid"
          class="q-mr-md"
          id="sync_btn">
          <q-badge color="red" floating rounded v-if="summary.pending_sync_tasks > 0">
            {{ summary.pending_sync_tasks }}
          </q-badge>
        </q-btn>
        <q-btn flat round dense icon="settings" @click="showSettings = true" id="settings_btn" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-md">
        <router-view />
      </div>
    </q-page-container>

    <q-footer bordered class="text-black" :class="darkMode ? 'bg-grey-8' : 'bg-grey-4'">
      <q-toolbar>
        <div class="row q-gutter-md col-6 items-center" id="summary">
          <SummaryGoal title="Day" :value="summary.worked_today" :goal="summary.goal_today" class="col" />
          <SummaryGoal title="Week" :value="summary.worked_week" :goal="summary.goal_week" class="col" />
          <div :class="darkMode ? 'text-white' : 'text-black'">Month: {{ formatDuration(summary.worked_month) }}</div>
        </div>
        <q-space />
        <q-toggle v-model="darkMode" icon="dark_mode" @update:model-value="setDarkMode" id="dark_mode" />
      </q-toolbar>
    </q-footer>
  </q-layout>
  <div v-else class="row justify-center q-pa-xl">
    <span>Loading...</span>
  </div>
  <Settings :show="showSettings" @close="showSettings = false" />
  <Sync :show="showSync" @close="showSync = false" />
</template>
