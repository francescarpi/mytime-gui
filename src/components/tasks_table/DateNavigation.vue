<script setup lang="ts">
import { useTasksStore, today } from "@/stores/tasks"
import { storeToRefs } from "pinia"
import { useCalendar } from "./calendar"

const tasksStore = useTasksStore()
const { nextFilterDate, previousFilterDate, refresh } = tasksStore
const { filterDate, isSearchEnabled } = storeToRefs(tasksStore)
const { dateLimits } = useCalendar()
</script>

<template>
  <div id="date_navigation">
    <q-btn icon="arrow_back" round color="primary" size="xs" class="q-ml-sm" @click="previousFilterDate"
      :disable="isSearchEnabled" />
    <q-btn icon="event" round color="primary" size="xs" class="q-mx-sm" :disable="isSearchEnabled">
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-date v-model="filterDate" mask="YYYY-MM-DD" first-day-of-week="1" today-btn :options="dateLimits">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup />
            <q-btn label="OK" color="primary" flat v-close-popup @click="refresh" />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn>
    <q-btn icon="arrow_forward" round color="primary" size="xs" @click="nextFilterDate"
      :disable="filterDate === today || isSearchEnabled" />
  </div>
</template>
