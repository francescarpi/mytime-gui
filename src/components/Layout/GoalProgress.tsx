import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import { formatDuration } from "../../utils/dates";
import Typography from "@mui/material/Typography";

const GoalProgress = ({
  sx,
  goal,
  value,
}: {
  sx?: SxProps<Theme>;
  goal: number;
  value: number;
}) => {
  const percentage = (value * 100) / goal;
  const color = percentage < 100 ? "error" : "success";

  return (
    <Box sx={{ ...sx, position: "relative" }}>
      <LinearProgress
        value={percentage > 100 ? 100 : percentage}
        variant="determinate"
        color={color}
        sx={{
          width: 200,
          border: "1px #fff solid",
          height: 20,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 10,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="subtitle2">
          {formatDuration(value)} of {formatDuration(goal)}
        </Typography>
      </Box>
    </Box>
  );
};
export default GoalProgress;
