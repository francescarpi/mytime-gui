import { Task } from "../../hooks/useTasks";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";

const StartStopActions = ({
  task,
  addTask,
  stopTask,
  setQuery,
}: {
  task: Task;
  addTask: CallableFunction;
  stopTask: CallableFunction;
  setQuery: CallableFunction;
}) => {
  const playTask = () => {
    addTask(task.project, task.desc, task.external_id);
    setQuery("");
  };

  return task.end ? (
    <Tooltip title="Start task" placement="top">
      <IconButton size="small" onClick={playTask}>
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
