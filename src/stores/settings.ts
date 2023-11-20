import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";
import type { Ref } from "vue";
import type { Settings } from "@/types/settings";

export const useSettingsStore = defineStore("settings", () => {
  const settings: Ref<Settings> = ref({
    integration: "",
    integration_url: "",
    integration_token: "",
  });

  const load = () => {
    invoke("settings").then((response: unknown) => {
      settings.value = JSON.parse(response as string) as Settings;
    });
  };

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
  ) => {
    return invoke("save_settings", {
      integration,
      url,
      token,
      workHoursMonday,
      workHoursTuesday,
      workHoursWednesday,
      workHoursThursday,
      workHoursFriday,
      workHoursSaturday,
      workHoursSunday,
    }).then(() => {
      load();
    });
  };

  const isValid = computed(() => {
    const s = settings.value;
    return (
      s.integration !== "" &&
      s.integration_url !== "" &&
      s.integration_token !== ""
    );
  });

  return {
    load,
    settings,
    save,
    isValid,
  };
});
