<script setup lang="ts">
import { RouterView } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { getVersion } from "@tauri-apps/api/app";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTasksStore } from "@/stores/tasks";
import { useSettingsStore } from "@/stores/settings";
import { formatDuration } from "@/utils/dates";
import Settings from "@/components/Settings.vue";
import Sync from "@/components/Sync.vue";

import type { Ref } from "vue";

const configReady: Ref<unknown> = ref(false);
const showSettings: Ref<boolean> = ref(false);
const showSync: Ref<boolean> = ref(false);

const tasksStore = useTasksStore();
const { summary } = storeToRefs(tasksStore);

const settingsStore = useSettingsStore();
const { isValid, goalToday, goalWeek } = storeToRefs(settingsStore);
const { load } = settingsStore;

getVersion().then((version) => {
  invoke("init", { version }).then(() => {
    configReady.value = true;
    load();
  });
});
</script>

<template>
  <q-layout view="hHh lpr fFf" v-if="configReady">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <q-icon name="timer" />
        </q-avatar>
        <q-toolbar-title> MyTime </q-toolbar-title>
        <q-chip
          color="red"
          text-color="white"
          icon="directions_run"
          v-if="summary.is_running"
          class="q-mr-xl"
          >Running</q-chip
        >
        <q-chip
          color="green"
          text-color="white"
          icon="local_cafe"
          v-else
          class="q-mr-xl"
          >Stopped</q-chip
        >
        <q-btn
          flat
          round
          dense
          icon="cloud_upload"
          @click="showSync = true"
          v-if="isValid"
          class="q-mr-md"
        >
          <q-badge
            color="red"
            floating
            rounded
            v-if="summary.pending_sync_tasks > 0"
            >{{ summary.pending_sync_tasks }}</q-badge
          >
        </q-btn>
        <q-btn flat round dense icon="settings" @click="showSettings = true" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-md">
        <router-view />
      </div>
    </q-page-container>

    <q-footer bordered class="bg-grey-2 text-black">
      <q-toolbar>
        <div class="row q-gutter-md full-width">
          <div>
            Worked on date:
            <span
              class="text-bold q-pl-xs"
              :class="
                summary.today - goalToday < 0 ? 'text-red-7' : 'text-green-8'
              "
            >
              {{ formatDuration(summary.today) }}
            </span>
          </div>
          <div class="q-pl-xl">
            Worked on date's week:
            <span
              class="text-bold"
              :class="
                summary.this_week - goalWeek < 0 ? 'text-red-7' : 'text-green-8'
              "
            >
              {{ formatDuration(summary.this_week) }}
            </span>
          </div>
          <div class="q-pl-xl">
            Worked on date's month:
            <span class="text-bold">
              {{ formatDuration(summary.this_month) }}
            </span>
          </div>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
  <div v-else class="row justify-center q-pa-xl">
    <span>Loading...</span>
  </div>
  <Settings :show="showSettings" @close="showSettings = false" />
  <Sync :show="showSync" @close="showSync = false" />
</template>
