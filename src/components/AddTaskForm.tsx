import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";

const AddTaskForm = ({ sx }: { sx?: SxProps<Theme> }) => {
  return (
    <Box sx={{ ...sx, flexgrow: 1 }}>
      <form>
        <Grid container spacing={2}>
          <Grid item md={2}>
            <TextField label="Project" size="small" fullWidth required />
          </Grid>
          <Grid item md={6}>
            <TextField label="Description" size="small" fullWidth required />
          </Grid>
          <Grid item md={2}>
            <TextField label="External Id" size="small" fullWidth />
          </Grid>
          <Grid item md={1}>
            <Button type="reset">Reset</Button>
          </Grid>
          <Grid item md={1}>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddTaskForm;
