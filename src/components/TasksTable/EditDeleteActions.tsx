import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Task } from "../../hooks/useTasks";

const EditDeleteActions = ({
  task,
  deleteHandler,
  setTaskToEdit,
}: {
  task: Task;
  deleteHandler: CallableFunction;
  setTaskToEdit: CallableFunction;
}) => {
  return (
    <>
      <Tooltip title="Delete task" placement="top">
        <IconButton size="small" onClick={() => deleteHandler(task.id)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit task" placement="top">
        <IconButton size="small" onClick={() => setTaskToEdit(task)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default EditDeleteActions;
