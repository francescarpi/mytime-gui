import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { IntegrationType } from "../integrations";

export enum ViewType {
  Grouped = "Grouped",
  Chronological = "Chronological",
}

export interface Setting {
  integration: IntegrationType | null;
  integration_config: any;
  integration_valid: boolean;
  work_hours: { [key: string]: number };
  theme: string;
  theme_secondary: string;
  view_type: ViewType;
  dark_mode: boolean;
  tour_completed: boolean;
  right_sidebar_open: boolean;
}

const useSettings = () => {
  const [setting, setSetting] = useState<Setting | null>(null);

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

  return {
    setting,
    changeViewType,
    toggleDarkMode,
    saveSettings,
    updateRightSidebarOpened,
  };
};

export default useSettings;
