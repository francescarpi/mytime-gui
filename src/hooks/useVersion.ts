import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { Octokit } from "@octokit/core";
import semver from "semver";

const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);
  const [urlNewVersion, setUrlNewVersion] = useState<string | null>(null);

  useEffect(() => {
    getVersion().then((res) => {
      setVersion(res);
    });
  }, []);

  useEffect(() => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    const owner = process.env.REACT_APP_GITHUB_OWNER;
    const repo = process.env.REACT_APP_GITHUB_REPO_NAME;

    if (!token || !owner || !repo || !version) {
      return;
    }

    const octokit = new Octokit({
      auth: token,
    });

    setTimeout(() => {
      console.log("Checking for new version...");
      octokit
        .request(`GET /repos/${owner}/${repo}/releases/latest`, {
          owner: "OWNER",
          repo: "REPO",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const tagToVersion = res.data.tag_name.replace("v", "");
            console.log("Current version:", version);
            console.log("Latest version:", tagToVersion);
            if (!res.data.draft && semver.gt(tagToVersion, version)) {
              setUrlNewVersion(res.data.html_url);
            }
          }
        });
    }, 1000);
  }, [version]);

  return { version, urlNewVersion };
};
export default useVersion;
