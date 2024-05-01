import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { IntegrationType } from "../integrations";

export enum ViewType {
  Grouped = "Grouped",
  Chronological = "Chronological",
}

export interface Setting {
  integration: IntegrationType | null;
  integration_url: string | null;
  integration_token: string | null;
  integration_extra_param: string | null;
  work_hours: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  theme: string;
  view_type: ViewType;
  dark_mode: boolean;
  tour_completed: boolean;
  right_sidebar_open: boolean;
}

const useSettings = () => {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [isIntegrationValid, setIsIntegrationValid] = useState<boolean>(false);

  const loadSettings = useCallback(() => {
    invoke("settings").then((res) => {
      console.log("Settings loaded", res);
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
    (dark_mode: boolean) => {
      const payload = { ...(setting as Setting), dark_mode };
      setSetting(payload);
      invoke("save_settings", { settings: payload });
    },
    [setting],
  );

  const updateRightSidebarOpened = useCallback(
    (right_sidebar_open: boolean) => {
      const payload = { ...(setting as Setting), right_sidebar_open };
      setSetting(payload);
      invoke("save_settings", { settings: payload });
    },
    [setting],
  );

  const saveSettings = (setting: Setting) =>
    invoke("save_settings", { settings: setting }).then(() => loadSettings());

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
    saveSettings,
    updateRightSidebarOpened,
  };
};

export default useSettings;
