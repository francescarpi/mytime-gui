import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { invoke } from "@tauri-apps/api";
import { dayOfTheWeek } from "@/utils/dates";

import type { Ref } from "vue";
import type { Settings } from "@/types/settings";

export const useSettingsStore = defineStore("settings", () => {
  const settings: Ref<Settings> = ref({
    integration: "",
    integration_url: "",
    integration_token: "",
    work_hours_monday: 8,
    work_hours_tuesday: 8,
    work_hours_wednesday: 8,
    work_hours_thursday: 8,
    work_hours_friday: 8,
    work_hours_saturday: 0,
    work_hours_sunday: 0,
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

  const goalToday = computed(() => {
    const today = dayOfTheWeek(new Date()).toLowerCase();
    return (settings as any).value[`work_hours_${today}`] * 3600;
  });

  const goalWeek = computed(() => {
    const work_hours_attrs = Object.keys(settings.value).filter(key => key.includes('work_hours_'));
    const total = work_hours_attrs.reduce((acc, attr) => acc + (settings as any).value[attr], 0);
    return total * 3600;
  })

  return {
    load,
    settings,
    save,
    isValid,
    goalToday,
    goalWeek,
  };
});
