import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Task } from "../../hooks/useTasks";
import { formatDuration } from "../../utils/dates";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import GroupedModal from "./GroupedModal";
import SyncIndicator from "./SyncIndicator";
import CopyStringToAddForm from "./CopyStringToAddForm";
import Tooltip from "@mui/material/Tooltip";
import CopyToClipboardBtn from "../CopyToClipboardBtn";

const Grouped = ({
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
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);

  useEffect(() => {
    if (taskDetails) {
      const existing = tasks.find((t) => t.id === taskDetails.id);
      if (existing) {
        setTaskDetails(existing);
      } else {
        setTaskDetails(null);
      }
    }
  }, [tasks, taskDetails]);

  return (
    <>
      <GroupedModal
        task={taskDetails}
        onClose={() => setTaskDetails(null)}
        deleteTask={deleteTask}
        setTaskToEdit={setTaskToEdit}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">External Id</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="center">Reported</TableCell>
              <TableCell align="center">Tasks</TableCell>
              <TableCell align="right" width={110}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={`${task.id}-${task.reported}-${task.end}`}>
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
                <TableCell align="right">
                  {formatDuration(task.duration as number)}
                </TableCell>
                <TableCell align="center">
                  <SyncIndicator task={task} />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    onClick={() => setTaskDetails(task)}
                  >
                    {(task.children as Task[]).length}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <CopyToClipboardBtn onClick={() => copyToClipboard(task)} />
                  {!task.has_running_tasks ? (
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
    </>
  );
};

export default Grouped;
