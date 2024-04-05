import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { Octokit } from "@octokit/core";

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

    octokit
      .request(`GET /repos/${owner}/${repo}/releases`, {
        owner: "OWNER",
        repo: "REPO",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .then((res) => {
        const validReleases = res.data.filter((release: any) => !release.draft);
        const lastRelease = validReleases[validReleases.length - 1];
        const tag = lastRelease.tag_name;
        const myVersion = `v${version}`;

        if (myVersion !== tag) {
          setUrlNewVersion(lastRelease.html_url);
        }
      });
  }, [version]);

  return { version, urlNewVersion };
};
export default useVersion;
