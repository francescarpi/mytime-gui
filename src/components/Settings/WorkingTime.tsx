import { Setting } from "../../hooks/useSettings";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputCustom from "../atoms/InputCustom";

const weekdays: string[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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
        {weekdays.map((day) => (
          <Grid item md={3} key={day}>
            <InputCustom
              label={day}
              value={setting?.work_hours[day].toString() || "0"}
              type="number"
              onChange={(e) => setValue(parseFloat(e.target.value), day)}
            />
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ mt: 1 }} variant="subtitle2">
        You can use decimals. For instance: 8.75 = 8h45m
      </Typography>
    </Box>
  );
};

export default WorkingTime;
