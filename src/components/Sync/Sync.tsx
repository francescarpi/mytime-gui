import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TaskIcon from "./TaskIcon";
import { formatDuration } from "../../utils/dates";
import { StyledBox } from "../../styles/modal";
import { SyncTask } from "../../hooks/useSync";
import { SuccessType } from "./types";

const Sync = ({
  opened,
  onClose,
  slotHeader = null,
  slotTableHeader = null,
  slotTableRow = null,
  tasks,
  integrationName,
  success,
  isSending,
  sendHandler,
  tasksSent,
}: {
  opened: boolean;
  onClose: CallableFunction;
  slotHeader?: ReactNode;
  slotTableHeader?: ReactNode;
  slotTableRow?: CallableFunction | null;
  tasks: SyncTask[];
  integrationName: string;
  success: SuccessType;
  isSending: boolean;
  sendHandler: CallableFunction;
  tasksSent: boolean;
  updateTaskExtraParam?: CallableFunction;
  setTasksSent?: CallableFunction;
}) => {
  if (!opened) {
    return null;
  }

  return (
    <Modal open={opened} onClose={() => onClose()}>
      <StyledBox width={1000}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Send tasks to {integrationName}
        </Typography>
        <Box>
          {slotHeader}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                    External Id
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                    Task Ids
                  </TableCell>
                  {slotTableHeader}
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell align="left">{task.desc}</TableCell>
                    <TableCell align="left" sx={{ textWrap: "nowrap" }}>
                      {task.date}
                    </TableCell>
                    <TableCell align="right">
                      {formatDuration(task.duration)}
                    </TableCell>
                    <TableCell align="right">{task.external_id}</TableCell>
                    <TableCell align="right">{task.ids.join(", ")}</TableCell>
                    {slotTableRow && slotTableRow(task)}
                    <TableCell align="center">
                      <TaskIcon task={task} success={success} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => onClose()}
              color="secondary"
              disabled={isSending}
            >
              Close
            </Button>
            {tasks.length > 0 && (
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => sendHandler()}
                disabled={isSending || tasksSent}
              >
                Send
              </Button>
            )}
          </Box>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Sync;
