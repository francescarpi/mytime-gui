import { useEffect } from "react";
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
                    <Tooltip
                      title={`Project: ${task.project} | Ext.ID: ${task.external_id}`}
                      placement="left"
                    >
                      <Box>
                        <Box>{task.desc}</Box>
                        <Typography variant="caption" color="text.secondary">
                          {task.project}{" "}
                          {task.external_id && `(${task.external_id})`}
                        </Typography>
                      </Box>
                    </Tooltip>
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
