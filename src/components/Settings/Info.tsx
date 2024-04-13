import Box from "@mui/material/Box";
import useInfo from "../../hooks/useInfo";
import List from '@mui/material/List';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { invoke } from "@tauri-apps/api";


const Info = () => {
  const { info } = useInfo();

  if (!info) {
    return <Box>Loading...</Box>;
  }

  const showFolder = () => {
    invoke('show_in_folder', { path: info.db_path });
  }

  return (
    <Box>
      <List>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <strong>Version</strong>
            <Box>{info.version}</Box>
          </Grid>
          <Grid item md={6}>
            <strong>Authors</strong>
            <Box>{info.authors}</Box>
          </Grid>
          <Grid item md={12}>
            <strong>Database path</strong>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {info.db_path}
              <Button onClick={showFolder}>Show folder</Button>
            </Box>
          </Grid>
          <Grid item md={6}>
            <strong>Total tasks</strong>
            <Box>{info.total_tasks}</Box>
          </Grid>
        </Grid>
      </List>
    </Box>
  )
}

export default Info;
