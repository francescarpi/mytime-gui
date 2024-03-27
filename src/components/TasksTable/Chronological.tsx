import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Task } from "../../hooks/useTasks";
import { formatDuration, dateToStrTime } from "../../utils/dates";
import { IconButton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import EditIcon from "@mui/icons-material/Edit";
import SyncIndicator from "./SyncIndicator";
import CopyStringToAddForm from "./CopyStringToAddForm";
import Tooltip from "@mui/material/Tooltip";
import CopyToClipboardBtn from "../CopyToClipboardBtn";

const Chronological = ({
  tasks,
  addTask,
  stopTask,
  copyToClipboard,
  deleteTask,
  setTaskToEdit,
  dispatchDefaultAddTaskValues,
}: {
  tasks: Task[];
  addTask: CallableFunction;
  stopTask: CallableFunction;
  copyToClipboard: CallableFunction;
  deleteTask: CallableFunction;
  setTaskToEdit: CallableFunction;
  dispatchDefaultAddTaskValues: CallableFunction;
}) => {
  const confirm = useConfirm();
  const deleteHandler = (id: number) => {
    confirm({ description: "Are you sure you want to delete this task?" }).then(
      () => deleteTask(id),
    );
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">#</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">External Id</TableCell>
            <TableCell align="right">Started</TableCell>
            <TableCell align="right">Ended</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="center">Reported</TableCell>
            <TableCell align="right" width={170}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={`${task.id}-${task.reported}-${task.end}`}>
              <TableCell align="center">{task.id.toString()}</TableCell>
              <TableCell sx={{ textWrap: "nowrap" }}>
                {task.project}
                <CopyStringToAddForm
                  dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                  type="setProj"
                  value={task.project}
                />
              </TableCell>
              <TableCell>
                {task.desc}
                <CopyStringToAddForm
                  dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                  type="setDesc"
                  value={task.desc}
                />
              </TableCell>
              <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                {task.external_id}
                <CopyStringToAddForm
                  dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                  type="setExtId"
                  value={task.external_id}
                />
              </TableCell>
              <TableCell align="right">{dateToStrTime(task.start)}</TableCell>
              <TableCell align="right">
                {task.end ? dateToStrTime(task.end) : ""}
              </TableCell>
              <TableCell align="right">
                {formatDuration(task.duration as number)}
              </TableCell>
              <TableCell align="center">
                <SyncIndicator task={task} />
              </TableCell>
              <TableCell align="right">
                {!task.reported && (
                  <>
                    <Tooltip title="Delete task" placement="top">
                      <IconButton
                        size="small"
                        onClick={() => deleteHandler(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit task" placement="top">
                      <IconButton
                        size="small"
                        onClick={() => setTaskToEdit(task)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <CopyToClipboardBtn onClick={() => copyToClipboard(task)} />
                {task.end ? (
                  <Tooltip title="Start task" placement="top">
                    <IconButton
                      size="small"
                      onClick={() =>
                        addTask(task.project, task.desc, task.external_id)
                      }
                    >
                      <PlayCircleIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Stop task" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => stopTask(task.id)}
                      color="error"
                    >
                      <StopCircleIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Chronological;
