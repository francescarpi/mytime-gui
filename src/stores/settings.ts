import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { invoke } from "@tauri-apps/api"
import { setCssVar } from "quasar"

import type { Ref } from "vue"
import type { Settings } from "@/types/settings"

export const useSettingsStore = defineStore("settings", () => {
  const settings: Ref<Settings | null> = ref(null)

  const applyTheme = () => {
    setCssVar("primary", settings.value?.theme || "#1976d2")
  }

  const load = async () => {
    return invoke("settings").then((response: unknown) => {
      settings.value = response as Settings
      applyTheme()
    })
  }

  const save = async (
    integration: string,
    url: string,
    token: string,
    monday: number,
    tuesday: number,
    wednesday: number,
    thursday: number,
    friday: number,
    saturday: number,
    sunday: number,
    theme: string,
    tour_completed: boolean
  ) => {
    const payload = {
      ...settings.value,
      integration: integration || null,
      integration_url: url || null,
      integration_token: token || null,
      work_hours: {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      },
      theme,
      tour_completed,
    }
    return invoke("save_settings", { settings: payload }).then(() => {
      load()
    })
  }

  const saveViewType = (view_type: string) => {
    const payload = { ...settings.value, view_type }
    invoke("save_settings", { settings: payload }).then(() => {
      load()
    })
  }

  const saveDarkMode = (dark_mode: boolean) => {
    const payload = { ...settings.value, dark_mode }
    invoke("save_settings", { settings: payload }).then(() => {
      load()
    })
  }

  const markTourCompleted = () => {
    const payload = { ...settings.value, tour_completed: true }
    invoke("save_settings", { settings: payload }).then(() => {
      load()
    })
  }

  const isValid = computed(() => {
    const s = settings.value
    return s?.integration !== null && s?.integration_url !== "" && s?.integration_token !== ""
  })

  return {
    load,
    settings,
    save,
    isValid,
    saveViewType,
    saveDarkMode,
    markTourCompleted,
  }
})
