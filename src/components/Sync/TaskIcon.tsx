import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CircularProgress from "@mui/material/CircularProgress";
import { Tooltip } from "@mui/material";

import { SyncTask } from "../../hooks/useSync";
import { SuccessType } from "./types";

const TaskIcon = ({
  task,
  success,
}: {
  task: SyncTask;
  success: SuccessType;
}) => {
  if (success[task.id] === undefined) {
    return <CloudOffIcon />;
  }

  if (success[task.id].sending) {
    return <CircularProgress size={20} />;
  }

  if (success[task.id].success) {
    return <CloudDoneIcon color="success" />;
  }

  return (
    <Tooltip title={success[task.id].error}>
      <ThunderstormIcon color="error" />
    </Tooltip>
  );
};

export default TaskIcon;
