import Box from "@mui/material/Box";
import FavoriteAction from "./FavouriteAction";
import { Task } from "../../hooks/useTasks";
import WarningIcon from "@mui/icons-material/Warning";
import Tooltip from "@mui/material/Tooltip";

const TaskId = ({
  task,
  toggleFavourite,
}: {
  task: Task;
  toggleFavourite: CallableFunction;
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FavoriteAction task={task} sx={{ mr: 1 }} toggle={toggleFavourite} />
      {task.id.toString()}
      {task.task_with_conflict && (
        <Tooltip
          title={`Check the start and end times. They seem are overlapping with the task ${task.task_with_conflict}.`}
        >
          <WarningIcon color="error" sx={{ ml: 1, fontSize: 18 }} />
        </Tooltip>
      )}
    </Box>
  );
};

export default TaskId;
