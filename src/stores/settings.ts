import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { invoke } from "@tauri-apps/api"
import { setCssVar } from "quasar"

import type { Ref } from "vue"
import type { Settings } from "@/types/settings"

export const useSettingsStore = defineStore("settings", () => {
  const settings: Ref<Settings> = ref({
    integration: "",
    integration_url: "",
    integration_token: "",
    work_hours: [8, 8, 8, 8, 8, 0, 0],
    theme: "#1976d2",
    view_type: "chronological",
    dark_mode: false,
    tour_completed: true,
  })

  const applyTheme = () => {
    setCssVar("primary", settings.value.theme)
  }

  const load = async () => {
    return invoke("settings").then((response: unknown) => {
      settings.value = JSON.parse(response as string) as Settings
      applyTheme()
    })
  }

  const save = async (
    integration: string,
    url: string,
    token: string,
    workHoursMonday: number,
    workHoursTuesday: number,
    workHoursWednesday: number,
    workHoursThursday: number,
    workHoursFriday: number,
    workHoursSaturday: number,
    workHoursSunday: number,
    theme: string,
    tourCompleted: boolean
  ) => {
    return invoke("save_settings", {
      integration,
      url,
      token,
      workHours: [
        workHoursMonday,
        workHoursTuesday,
        workHoursWednesday,
        workHoursThursday,
        workHoursFriday,
        workHoursSaturday,
        workHoursSunday,
      ],
      theme,
      tourCompleted,
    }).then(() => {
      load()
    })
  }

  const saveViewType = (viewType: string) => {
    invoke("save_view_type", { viewType }).then(() => {
      load()
    })
  }

  const saveDarkMode = (darkMode: boolean) => {
    invoke("save_dark_mode", { darkMode }).then(() => {
      load()
    })
  }

  const markTourCompleted = () => {
    invoke("mark_tour_completed").then(() => {
      load()
    })
  }

  const isValid = computed(() => {
    const s = settings.value
    return s.integration !== "" && s.integration_url !== "" && s.integration_token !== ""
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
