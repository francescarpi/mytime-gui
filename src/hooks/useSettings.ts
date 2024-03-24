import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api";

export type ViewType = "Grouped" | "Chronological";

export interface Setting {
  integration: String | null;
  integration_url: String | null;
  integration_token: String | null;
  work_hours: {
    monday: Number;
    tuesday: Number;
    wednesday: Number;
    thursday: Number;
    friday: Number;
    saturday: Number;
    sunday: Number;
  };
  theme: String;
  view_type: ViewType;
  dark_mode: Boolean;
  tour_completed: Boolean;
}

const useSettings = () => {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [isIntegrationValid, setIsIntegrationValid] = useState<Boolean>(false);

  const loadSettings = useCallback(() => {
    invoke("settings").then((res) => {
      setSetting(res as Setting);
    });
  }, []);

  const changeViewType = useCallback(
    (view_type: ViewType) => {
      const payload = { ...(setting as Setting), view_type };
      setSetting(payload);
      invoke("save_settings", { settings: payload });
    },
    [setting],
  );

  const toggleDarkMode = useCallback(
    (dark_mode: Boolean) => {
      const payload = { ...(setting as Setting), dark_mode };
      setSetting(payload);
      invoke("save_settings", { settings: payload });
    },
    [setting],
  );

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setIsIntegrationValid(
      setting?.integration !== null &&
        setting?.integration_url !== null &&
        setting?.integration_token !== null,
    );
  }, [setting]);

  return {
    setting,
    isIntegrationValid,
    changeViewType,
    toggleDarkMode,
  };
};

export default useSettings;
