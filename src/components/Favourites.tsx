import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import { StyledBox } from "../styles/modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Task } from "../hooks/useTasks";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Button from "@mui/material/Button";

const Favourites = ({
  opened,
  onClose,
  favourites,
  load,
  addTask,
  toggleFavourite,
}: {
  opened: boolean;
  onClose: CallableFunction;
  favourites: Task[];
  load: CallableFunction;
  addTask: CallableFunction;
  toggleFavourite: CallableFunction;
}) => {
  useEffect(() => {
    if (opened) {
      load();
    }
  }, [opened, load]);

  const startTask = (task: Task) => {
    addTask(task.project, task.desc, task.external_id);
    onClose();
  };

  return (
    <Modal open={opened} onClose={() => onClose()}>
      <StyledBox>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Favourite tasks
        </Typography>
        <Box>
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">External Id</TableCell>
                  <TableCell align="right" width={100}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favourites.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell align="center">{task.id.toString()}</TableCell>
                    <TableCell sx={{ textWrap: "nowrap" }}>
                      {task.project}
                    </TableCell>
                    <TableCell>{task.desc}</TableCell>
                    <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                      {task.external_id}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Unmark favourite" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => toggleFavourite(task.id)}
                        >
                          <BookmarkIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Start task" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => startTask(task)}
                        >
                          <PlayCircleIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={() => onClose()}>
              Close
            </Button>
          </Box>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Favourites;
