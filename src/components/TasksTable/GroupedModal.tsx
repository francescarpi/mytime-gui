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
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  backgroundColor: theme.palette.background.paper,
  borderSize: 2,
  borderStyle: "solid",
  borderColor: theme.palette.primary.main,
  boxShadow: theme.shadows[24],
  padding: 20,
}));

const GroupedModal = ({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: CallableFunction;
}) => {
  return (
    <Modal open={Boolean(task)} onClose={() => onClose()}>
      <StyledBox>
        <Typography variant="h5">{task?.desc}</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="right">Started</TableCell>
                <TableCell align="right">Ended</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="center">Reported</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {task?.children?.map((child, index) => (
                <TableRow key={`${child.id}-${child.reported}-${child.end}`}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="right">
                    {dateToStrTime(child.start)}
                  </TableCell>
                  <TableCell align="right">
                    {child.end ? dateToStrTime(child.end) : ""}
                  </TableCell>
                  <TableCell align="right">
                    {formatDuration(child.duration as number)}
                  </TableCell>
                  <TableCell align="center">
                    {child.reported ? <CloudDoneIcon /> : <CloudOffIcon />}
                  </TableCell>
                  <TableCell align="right"></TableCell>
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
