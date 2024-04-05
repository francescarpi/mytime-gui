import { Setting } from "../../hooks/useSettings";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const WorkingTime = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const setValue = (value: number, day: string) =>
    setSetting({
      ...setting,
      work_hours: {
        ...setting?.work_hours,
        [day]: value,
      },
    });

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <TextField
            label="Monday"
            fullWidth
            value={setting?.work_hours.monday || 0}
            type="number"
            onChange={(e) => setValue(parseFloat(e.target.value), "monday")}
          />
        </Grid>
        <Grid item md={3}>
          <TextField
            label="Tuesday"
            fullWidth
            value={setting?.work_hours.tuesday || 0}
            type="number"
            onChange={(e) => setValue(parseFloat(e.target.value), "tuesday")}
          />
        </Grid>
        <Grid item md={3}>
          <TextField
            label="Wednesday"
            fullWidth
            value={setting?.work_hours.wednesday || 0}
            type="number"
            onChange={(e) => setValue(parseFloat(e.target.value), "wednesday")}
          />
        </Grid>
        <Grid item md={3}>
          <TextField
            label="Thursday"
            fullWidth
            value={setting?.work_hours.thursday || 0}
            type="number"
            onChange={(e) => setValue(parseFloat(e.target.value), "thursday")}
          />
        </Grid>
        <Grid item md={3}>
          <TextField
            label="Friday"
            fullWidth
            value={setting?.work_hours.friday || 0}
            type="number"
            onChange={(e) => setValue(parseFloat(e.target.value), "friday")}
          />
        </Grid>
        <Grid item md={3}>
          <TextField
            label="Saturday"
            fullWidth
            value={setting?.work_hours.saturday || 0}
            type="number"
            onChange={(e) => setValue(parseFloat(e.target.value), "saturday")}
          />
        </Grid>
        <Grid item md={3}>
          <TextField
            label="Sunday"
            fullWidth
            value={setting?.work_hours.sunday || 0}
            type="number"
            onChange={(e) => setValue(parseFloat(e.target.value), "sunday")}
          />
        </Grid>
      </Grid>
      <Typography sx={{ mt: 1 }} variant="subtitle2">
        You can use decimals. For instance: 8.75 = 8h45m
      </Typography>
    </Box>
  );
};

export default WorkingTime;
