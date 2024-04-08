import { Task } from "../../hooks/useTasks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatDuration, dateToStrTime } from "../../utils/dates";
import Button from "@mui/material/Button";
import { useConfirm } from "material-ui-confirm";
import { StyledBox } from "../../styles/modal";
import EditDeleteActions from "./EditDeleteActions";
import FavoriteAction from "./FavouriteAction";

const GroupedModal = ({
  task,
  onClose,
  deleteTask,
  setTaskToEdit,
  toggleFavourite,
}: {
  task: Task | null;
  onClose: CallableFunction;
  deleteTask: CallableFunction;
  setTaskToEdit: CallableFunction;
  toggleFavourite: CallableFunction;
}) => {
  const confirm = useConfirm();
  const deleteHandler = (id: number) => {
    confirm({ description: "Are you sure you want to delete this task?" }).then(
      () => deleteTask(id),
    );
  };
  return (
    <Modal open={Boolean(task)} onClose={() => onClose()}>
      <StyledBox width={600}>
        <Typography variant="h5">{task?.desc}</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="right">Started</TableCell>
                <TableCell align="right">Ended</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {task?.children?.map((child) => (
                <TableRow key={`${child.id}-${child.reported}-${child.end}`}>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FavoriteAction
                        task={child}
                        sx={{ mr: 1 }}
                        toggle={toggleFavourite}
                      />
                      {child.id.toString()}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {dateToStrTime(child.start)}
                  </TableCell>
                  <TableCell align="right">
                    {child.end ? dateToStrTime(child.end) : ""}
                  </TableCell>
                  <TableCell align="right">
                    {formatDuration(child.duration as number)}
                  </TableCell>
                  <TableCell align="right">
                    {!task.reported && (
                      <EditDeleteActions
                        task={task}
                        deleteHandler={deleteHandler}
                        setTaskToEdit={setTaskToEdit}
                      />
                    )}
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
      </StyledBox>
    </Modal>
  );
};

export default GroupedModal;
