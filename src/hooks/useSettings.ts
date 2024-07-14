import { useState, useCallback, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";

export enum ViewType {
  Grouped = "Grouped",
  Chronological = "Chronological",
}

export interface Setting {
  work_hours: { [key: string]: number };
  theme: string;
  theme_secondary: string;
  view_type: ViewType;
  dark_mode: boolean;
  tour_completed: boolean;
  right_sidebar_open: boolean;
}

export interface Integration {
  id: number | null;
  itype: string;
  active: boolean;
  name: string | null;
  config: any | null;
}

const useSettings = () => {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const loadSettings = useCallback(() => {
    invoke("settings").then((res) => {
      console.log("Settings loaded", res);
      setSetting(res as Setting);
    });
  }, []);

  const loadIntegrations = useCallback(() => {
    invoke("integrations").then((res) => setIntegrations(res as Integration[]));
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

  const saveSettings = (setting: Setting, integ: Integration[]) => {
    invoke("save_settings", { settings: setting }).then(() => loadSettings());

    integ.forEach((integration) => {
      const action =
        integration.id === null ? "add_integration" : "update_integration";
      invoke(action, { integration }).then(() => loadIntegrations());
    });
  };

  const deleteIntegration = (id: number) =>
    invoke("delete_integration", { id }).then(() => loadIntegrations());

  const activeIntegrations = useMemo(
    () => integrations.filter((i) => i.active),
    [integrations],
  );

  useEffect(() => {
    loadSettings();
    loadIntegrations();
  }, [loadSettings, loadIntegrations]);

  return {
    setting,
    changeViewType,
    toggleDarkMode,
    saveSettings,
    updateRightSidebarOpened,
    loadIntegrations,
    integrations,
    deleteIntegration,
    activeIntegrations,
  };
};

export default useSettings;
