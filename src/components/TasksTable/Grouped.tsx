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
import GroupedModal from "./GroupedModal";
import SyncIndicator from "./SyncIndicator";
import CopyStringToAddForm from "./CopyStringToAddForm";
import CopyToClipboardBtn from "../CopyToClipboardBtn";
import Box from "@mui/material/Box";
import StartStopActions from "./StartStopActions";

const Grouped = ({
  tasks,
  addTask,
  stopTask,
  copyToClipboard,
  deleteTask,
  setTaskToEdit,
  dispatchDefaultAddTaskValues,
  toggleFavourite,
}: {
  tasks: Task[];
  addTask: CallableFunction;
  stopTask: CallableFunction;
  copyToClipboard: CallableFunction;
  deleteTask: CallableFunction;
  setTaskToEdit: CallableFunction;
  dispatchDefaultAddTaskValues: CallableFunction;
  toggleFavourite: CallableFunction;
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
        toggleFavourite={toggleFavourite}
      />
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">External Id</TableCell>
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
    </>
  );
};

export default Grouped;
