import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import { Task } from "../../hooks/useTasks";
import { formatDuration } from "../../utils/dates";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Button from "@mui/material/Button";

const Grouped = ({ tasks }: { tasks: Task[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <KeyboardCommandKeyIcon fontSize="small" />
            </TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">External Id</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="center">Reported</TableCell>
            <TableCell align="center">Tasks</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={`${task.id}-${task.reported}-${task.end}`}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{task.project}</TableCell>
              <TableCell>{task.desc}</TableCell>
              <TableCell align="right">{task.external_id}</TableCell>
              <TableCell align="right">
                {formatDuration(task.duration as number)}
              </TableCell>
              <TableCell align="center">
                {task.reported ? <CloudDoneIcon /> : <CloudOffIcon />}
              </TableCell>
              <TableCell align="center">
                <Button variant="contained" disableElevation size="small">
                  {(task.children as Task[]).length}
                </Button>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Grouped;
