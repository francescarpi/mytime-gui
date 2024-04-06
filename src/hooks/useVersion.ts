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
      .request(`GET /repos/${owner}/${repo}/releases/latest`, {
        owner: "OWNER",
        repo: "REPO",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      })
      .then((res) => {
        if (
          res.status === 200 &&
          res.data &&
          res.data.tag_name !== `v${version}`
        ) {
          setUrlNewVersion(res.data.html_url);
        }
      });
  }, [version]);

  return { version, urlNewVersion };
};
export default useVersion;
