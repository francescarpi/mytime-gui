import { useEffect, useState } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { getVersion } from "@tauri-apps/api/app";

const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);
  const [newVersion, setNewVersion] = useState<Update | null>(null);

  useEffect(() => {
    getVersion().then((version) => {
      setVersion(version);
    });

    check().then((update) => {
      if (update?.available) {
        setNewVersion(update);
      }
    });
  }, []);

  return { version, newVersion };
};
export default useVersion;
