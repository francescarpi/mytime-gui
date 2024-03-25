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
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GroupedModal from "./GroupedModal";
import UpgradeIcon from "@mui/icons-material/Upgrade";

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
                  <IconButton
                    size="small"
                    onClick={() =>
                      dispatchDefaultAddTaskValues({
                        type: "setProj",
                        value: task.project,
                      })
                    }
                  >
                    <UpgradeIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  {task.desc}
                  <IconButton
                    size="small"
                    onClick={() =>
                      dispatchDefaultAddTaskValues({
                        type: "setDesc",
                        value: task.desc,
                      })
                    }
                  >
                    <UpgradeIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                  {task.external_id}
                  <IconButton
                    size="small"
                    onClick={() =>
                      dispatchDefaultAddTaskValues({
                        type: "setExtId",
                        value: task.external_id,
                      })
                    }
                  >
                    <UpgradeIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  {formatDuration(task.duration as number)}
                </TableCell>
                <TableCell align="center">
                  {task.reported ? <CloudDoneIcon /> : <CloudOffIcon />}
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
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(task)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  {!task.has_running_tasks ? (
                    <IconButton
                      size="small"
                      onClick={() =>
                        addTask(task.project, task.desc, task.external_id)
                      }
                    >
                      <PlayCircleIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={() => stopTask(task.id)}
                      color="error"
                    >
                      <StopCircleIcon />
                    </IconButton>
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
