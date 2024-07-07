import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface Integration {
  id: number;
  itype: string;
  active: boolean;
  name: string | null;
  config: string;
}

const useIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  const refresh = useCallback(() => {
    invoke("integrations").then((res) => setIntegrations(res as Integration[]));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { refresh, integrations };
};

export default useIntegrations;
