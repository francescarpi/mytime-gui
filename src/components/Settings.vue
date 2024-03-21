<script setup lang="ts">
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/stores/settings"
import { integrations, getIntegration } from "@/utils/settings"
import { useQuasar, setCssVar } from "quasar"

import type { Settings, Option } from "@/types/settings"
import type { Ref } from "vue"

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const { save } = settingsStore
const $q = useQuasar()

const activeTab = ref("general")
const workHoursMonday = ref(0)
const workHoursTuesday = ref(0)
const workHoursWednesday = ref(0)
const workHoursThursday = ref(0)
const workHoursFriday = ref(0)
const workHoursSaturday = ref(0)
const workHoursSunday = ref(0)
const theme: Ref<string> = ref("")
const tourCompleted: Ref<boolean> = ref(true)

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(["close"])

const beforeClose = () => {
  setCssVar("primary", (settings.value as Settings).theme)
  emit("close")
}

const integration: Ref<Option> = ref(integrations[0])
const integration_token: Ref<string> = ref("")
const integration_url: Ref<string> = ref("")

const beforeShow = () => {
  const set: Settings = settings.value as Settings
  integration.value = getIntegration(set.integration)
  integration_url.value = set.integration_url
  integration_token.value = set.integration_token

  workHoursMonday.value = set.work_hours.monday
  workHoursTuesday.value = set.work_hours.tuesday
  workHoursWednesday.value = set.work_hours.wednesday
  workHoursThursday.value = set.work_hours.thursday
  workHoursFriday.value = set.work_hours.friday
  workHoursSaturday.value = set.work_hours.saturday
  workHoursSunday.value = set.work_hours.sunday

  theme.value = set.theme
  activeTab.value = "general"
  tourCompleted.value = set.tour_completed
}

const saveHandler = () => {
  save(
    integration.value?.value || "",
    integration_url.value || "",
    integration_token.value || "",
    workHoursMonday.value,
    workHoursTuesday.value,
    workHoursWednesday.value,
    workHoursThursday.value,
    workHoursFriday.value,
    workHoursSaturday.value,
    workHoursSunday.value,
    theme.value,
    tourCompleted.value
  ).then(() => {
    $q.notify({
      message: "Settings saved successfully",
      position: "top",
    })
    beforeClose()
  })
}

const changeTheme = (color: string) => {
  setCssVar("primary", color)
}
</script>

<template>
  <q-dialog :model-value="props.show" @before-hide="beforeClose" @before-show="beforeShow">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Settings</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify">
          <q-tab name="general" label="General" />
          <q-tab name="integrations" label="Integrations" />
          <q-tab name="calendar" label="Work hours" />
        </q-tabs>
      </q-card-section>

      <q-tab-panels v-model="activeTab" animated class="shadow-2">
        <q-tab-panel name="general">
          <div class="row q-gutter-md">
            <div class="col">
              <q-toggle v-model="tourCompleted" label="Help tour completed?" class="q-mt-md" />
            </div>
            <div class="col">
              <span>Theme:</span>
              <q-color v-model="theme" no-footer @change="changeTheme" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="integrations">
          <q-card-section class="q-gutter-md">
            <q-select filled label="Integration" v-model="integration" :options="integrations" />
            <q-input filled label="URL" v-model="integration_url" />
            <q-input filled label="Token" v-model="integration_token" type="password" />
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="calendar" class="q-gutter-xs">
          <div class="row q-gutter-xs">
            <q-input v-model.number="workHoursMonday" class="col" filled label="Monday" type="number" />
            <q-input v-model.number="workHoursTuesday" class="col" filled label="Tuesday" type="number" />
            <q-input v-model.number="workHoursWednesday" class="col" filled label="Wednesday" type="number" />
            <q-input v-model.number="workHoursThursday" class="col" filled label="Thursday" type="number" />
            <q-input v-model.number="workHoursFriday" class="col" filled label="Friday" type="number" />
          </div>
          <div class="row q-gutter-xs">
            <q-input v-model.number="workHoursSaturday" class="col" filled label="Saturaday" type="number" />
            <q-input v-model.number="workHoursSunday" class="col-6" filled label="Sunday" type="number" />
          </div>
          <div class="row q-gutter-xs text-caption">
            <span>You can use decimals. For instance: 8.75 = 8h45m</span>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-section class="row q-gutter-md justify-end">
        <q-btn color="primary" @click="saveHandler">Save</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
