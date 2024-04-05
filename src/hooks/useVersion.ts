import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";

const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);

  const checkNewVersion = () => {};

  useEffect(() => {
    getVersion().then((res) => {
      setVersion(res);
    });
  }, []);

  return { version };
};
export default useVersion;
