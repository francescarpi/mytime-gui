import { useEffect, useState } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";

const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);
  const [newVersion, setNewVersion] = useState<Update | null>(null);

  useEffect(() => {
    check().then((update) => {
      if (update?.available) {
        const { currentVersion } = update;
        setVersion(currentVersion);
        setNewVersion(update);
      }
    });
  }, []);

  return { version, newVersion };
};
export default useVersion;
