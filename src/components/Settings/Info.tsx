import Box from "@mui/material/Box";
import useInfo from "../../hooks/useInfo";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { invoke } from "@tauri-apps/api";
import GitHubIcon from "@mui/icons-material/GitHub";

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
      <List>
        <Grid container spacing={2}>
          <Grid item md={4}>
            <strong>Version</strong>
            <Box>{info.version}</Box>
          </Grid>
          <Grid item md={5}>
            <strong>Authors</strong>
            <Box>{info.authors}</Box>
          </Grid>
          <Grid item md={3}>
            <strong>Total tasks</strong>
            <Box>{info.total_tasks}</Box>
          </Grid>
          <Grid item md={12}>
            <strong>Database path</strong>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {info.db_path}
              <Button onClick={showFolder}>Show folder</Button>
            </Box>
          </Grid>
          <Grid item md={12} sx={{ mt: 2 }}>
            <Box>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href="https://github.com/francescarpi/mytime-gui"
                target="_blank"
              >
                Contribute
              </Button>
            </Box>
          </Grid>
        </Grid>
      </List>
    </Box>
  );
};

export default Info;
