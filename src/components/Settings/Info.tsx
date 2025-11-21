import { Box, Button, Link } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import GitHubIcon from "@mui/icons-material/GitHub";
import GradingIcon from "@mui/icons-material/Grading";
import { Grid } from "@mui/material";

import useInfo from "../../hooks/useInfo";

const Info = () => {
  const { info } = useInfo();

  if (!info) {
    return <Box>Loading...</Box>;
  }

  const showFolder = () => {
    invoke("show_in_folder", { path: info.db_path });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={4}>
          <strong>Version</strong>
          <Box>{info.version}</Box>
        </Grid>
        <Grid size={5}>
          <strong>Authors</strong>
          <Box>{info.authors}</Box>
        </Grid>
        <Grid size={3}>
          <strong>Total tasks</strong>
          <Box>{info.total_tasks}</Box>
        </Grid>
        <Grid size={12}>
          <strong>Database path</strong>
          <Box>
            <Link onClick={showFolder} href="#">
              {info.db_path}
            </Link>
          </Box>
        </Grid>
        <Grid size={12} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            href="https://github.com/francescarpi/mytime-gui"
            target="_blank"
          >
            Contribute
          </Button>
          <Button
            sx={{ ml: 2 }}
            variant="outlined"
            startIcon={<GradingIcon />}
            href="https://github.com/francescarpi/mytime-gui/blob/main/CHANGELOG.md"
            target="_blank"
          >
            Changelog
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Info;
