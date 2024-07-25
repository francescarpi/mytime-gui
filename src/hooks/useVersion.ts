import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { Octokit } from "@octokit/core";
import semver from "semver";

export interface NewVersion {
  url: string;
  version: string;
}

const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);
  const [newVersion, setNewVersion] = useState<NewVersion | null>(null);

  useEffect(() => {
    getVersion().then((res) => {
      setVersion(res);
    });
  }, []);

  useEffect(() => {
    const token = import.meta.env.VITE_APP_GITHUB_TOKEN;
    const owner = import.meta.env.VITE_APP_GITHUB_OWNER;
    const repo = import.meta.env.VITE_APP_GITHUB_REPO_NAME;

    if (!token || !owner || !repo || !version) {
      return;
    }

    const octokit = new Octokit({
      auth: token,
    });

    // setTimeout(() => {
    //   console.log("Checking for new version...");
    //   octokit
    //     .request(`GET /repos/${owner}/${repo}/releases/latest`, {
    //       owner: "OWNER",
    //       repo: "REPO",
    //       headers: {
    //         "X-GitHub-Api-Version": "2022-11-28",
    //       },
    //     })
    //     .then((res) => {
    //       if (res.status === 200) {
    //         const tagToVersion = res.data.tag_name.replace("v", "");
    //         console.log("Current version:", version);
    //         console.log("Latest version:", tagToVersion);
    //         if (!res.data.draft && semver.gt(tagToVersion, version)) {
    //           setNewVersion({ url: res.data.html_url, version: tagToVersion });
    //         }
    //       }
    //     })
    //     .catch(() => {
    //       console.error("Error while checking for new version.");
    //     });
    // }, 1000);
  }, [version]);

  return { version, newVersion };
};
export default useVersion;
