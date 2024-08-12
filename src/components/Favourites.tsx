import { useEffect } from "react";

import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { Task } from "../hooks/useTasks";

const Favourites = ({
  favourites,
  load,
  addTask,
  toggleFavourite,
}: {
  favourites: Task[];
  load: CallableFunction;
  addTask: CallableFunction;
  toggleFavourite: CallableFunction;
}) => {
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTask = (task: Task) => {
    addTask(task.project, task.desc, task.external_id);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Favourite tasks
      </Typography>
      <Box>
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: "100%" }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right" width={100}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {favourites.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Box>{task.desc}</Box>
                    <Typography variant="caption" color="text.secondary">
                      {task.project}
                      {task.external_id && ` (${task.external_id})`}
                    </Typography>
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
                      <IconButton size="small" onClick={() => startTask(task)}>
                        <PlayCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Favourites;
