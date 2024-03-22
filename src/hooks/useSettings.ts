import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api";

interface Setting {
  integration: string | null;
  integration_url: string | null;
  integration_token: string | null;
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
  view_type: string;
  dark_mode: boolean;
  tour_completed: boolean;
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
