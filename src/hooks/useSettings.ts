import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api";

interface Setting {
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
  view_type: "Grouped" | "Chronological";
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
  };
};

export default useSettings;
