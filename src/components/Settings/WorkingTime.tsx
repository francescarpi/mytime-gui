import { Setting } from "../../hooks/useSettings";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { Grid } from "@mui/material";

import MyInputField from "../atoms/MyInputField";

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

  const total = useMemo(
    () =>
      weekdays
        .map((wd) => setting?.work_hours[wd] || 0)
        .reduce((acc, value) => acc + value, 0),
    [setting],
  );

  return (
    <Box>
      <Grid container spacing={2}>
        {weekdays.map((day) => (
          <Grid size={3} key={day}>
            <MyInputField
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
      <Typography variant="subtitle2">
        Total week work time: {total} hours
      </Typography>
    </Box>
  );
};

export default WorkingTime;
