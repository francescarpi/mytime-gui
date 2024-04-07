import { Task } from "../../hooks/useTasks";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";

const StartStopActions = ({
  task,
  addTask,
  stopTask,
}: {
  task: Task;
  addTask: CallableFunction;
  stopTask: CallableFunction;
}) => {
  return task.end ? (
    <Tooltip title="Start task" placement="top">
      <IconButton
        size="small"
        onClick={() => addTask(task.project, task.desc, task.external_id)}
      >
        <PlayCircleIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Stop task" placement="top">
      <IconButton size="small" onClick={() => stopTask(task.id)} color="error">
        <StopCircleIcon />
      </IconButton>
    </Tooltip>
  );
};
export default StartStopActions;
