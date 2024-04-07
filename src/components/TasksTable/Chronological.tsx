import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Task } from "../../hooks/useTasks";
import { formatDuration, dateToStrTime } from "../../utils/dates";
import { useConfirm } from "material-ui-confirm";
import SyncIndicator from "./SyncIndicator";
import CopyStringToAddForm from "./CopyStringToAddForm";
import CopyToClipboardBtn from "../CopyToClipboardBtn";
import Box from "@mui/material/Box";
import EditDeleteActions from "./EditDeleteActions";
import StartStopActions from "./StartStopActions";

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
                <CopyStringToAddForm
                  dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                  type="setProj"
                  value={task.project}
                />
                {task.project}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <CopyStringToAddForm
                      dispatchDefaultAddTaskValues={
                        dispatchDefaultAddTaskValues
                      }
                      type="setDesc"
                      value={task.desc}
                    />
                  </Box>
                  <Box>{task.desc}</Box>
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                <CopyStringToAddForm
                  dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                  type="setExtId"
                  value={task.external_id}
                />
                {task.external_id}
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
                  <EditDeleteActions
                    task={task}
                    deleteHandler={deleteHandler}
                    setTaskToEdit={setTaskToEdit}
                  />
                )}
                <CopyToClipboardBtn onClick={() => copyToClipboard(task)} />
                <StartStopActions
                  task={task}
                  addTask={addTask}
                  stopTask={stopTask}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Chronological;
