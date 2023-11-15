<script setup lang="ts">
import { RouterView } from "vue-router";
import { invoke } from "@tauri-apps/api";
import { ref, onMounted } from "vue";
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
const { isValid } = storeToRefs(settingsStore);
const { load } = settingsStore;

invoke("config_ready").then(() => {
  configReady.value = true;
});

onMounted(() => {
  load();
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
        <q-chip color="red" text-color="white" icon="directions_run" v-if="summary.is_running" class="q-mr-xl">Running</q-chip>
        <q-chip color="green" text-color="white" icon="airline_seat_recline_normal" v-else class="q-mr-xl">Stopped</q-chip>
        <q-btn flat round dense icon="cloud_upload" @click="showSync = true" v-if="isValid" />
        <q-btn flat round dense icon="settings" @click="showSettings = true" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-md">
        <router-view />
      </div>
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <div class="row q-gutter-md full-width">
          <div>
            Worked on date:
            <span class="text-bold">{{
              formatDuration(summary.today)
            }}</span>
          </div>
          <div>
            Worked on date's week:
            <span class="text-bold">{{
              formatDuration(summary.this_week)
            }}</span>
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
