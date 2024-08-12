import { LinearProgress, Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

import { formatDuration } from "../../utils/dates";

const GoalProgress = ({
  sx,
  goal,
  value,
}: {
  sx?: SxProps<Theme>;
  goal: number;
  value: number;
}) => {
  const percentage = goal === 0 ? 0 : (value * 100) / goal;
  const color = percentage < 100 ? "error" : "success";

  const extra = goal - value;
  const extraReal = extra >= 0 ? 0 : Math.abs(extra);

  return (
    <Box sx={{ ...sx, position: "relative" }}>
      <LinearProgress
        value={percentage > 100 ? 100 : percentage}
        variant="determinate"
        color={color}
        sx={{
          width: 200,
          height: 20,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="subtitle2">
          {formatDuration(value)} of {formatDuration(goal)}
          {extraReal > 0 && ` (+${formatDuration(extraReal)})`}
        </Typography>
      </Box>
    </Box>
  );
};
export default GoalProgress;
