import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import { Task } from "../../hooks/useTasks";
import { formatDuration, dateToStrTime } from "../../utils/dates";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { IconButton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Chronological = ({
  tasks,
  addTask,
  stopTask,
  copyToClipboard,
}: {
  tasks: Task[];
  addTask: CallableFunction;
  stopTask: CallableFunction;
  copyToClipboard: CallableFunction;
}) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <KeyboardCommandKeyIcon fontSize="small" />
            </TableCell>
            <TableCell align="center">#</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">External Id</TableCell>
            <TableCell align="right">Started</TableCell>
            <TableCell align="right">Ended</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="center">Reported</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={`${task.id}-${task.reported}-${task.end}`}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell align="center">{task.id.toString()}</TableCell>
              <TableCell>{task.project}</TableCell>
              <TableCell>{task.desc}</TableCell>
              <TableCell align="right">{task.external_id}</TableCell>
              <TableCell align="right">{dateToStrTime(task.start)}</TableCell>
              <TableCell align="right">
                {task.end ? dateToStrTime(task.end) : ""}
              </TableCell>
              <TableCell align="right">
                {formatDuration(task.duration as number)}
              </TableCell>
              <TableCell align="center">
                {task.reported ? <CloudDoneIcon /> : <CloudOffIcon />}
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => copyToClipboard(task)}>
                  <ContentCopyIcon />
                </IconButton>
                {task.end ? (
                  <IconButton
                    size="small"
                    onClick={() =>
                      addTask(task.project, task.desc, task.external_id)
                    }
                  >
                    <PlayCircleIcon />
                  </IconButton>
                ) : (
                  <IconButton size="small" onClick={() => stopTask(task.id)}>
                    <StopCircleIcon />
                  </IconButton>
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
