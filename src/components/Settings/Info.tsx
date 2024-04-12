import Box from "@mui/material/Box";
import useInfo from "../../hooks/useInfo";
import List from '@mui/material/List';
import Grid from "@mui/material/Grid";


const Info = () => {
  const { info } = useInfo();

  if (!info) {
    return <Box>Loading...</Box>;
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
            <Box>{info.db_path}</Box>
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
