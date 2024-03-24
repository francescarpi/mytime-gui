import { useEffect, useState, useReducer } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { StyledBox } from "../styles/modal";
import Typography from "@mui/material/Typography";
import { Setting } from "../hooks/useSettings";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSync from "../hooks/useSync";
import { formatDuration } from "../utils/dates";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Tooltip from "@mui/material/Tooltip";

const successReducer = (
  state: { [key: string]: { success: boolean; error?: string } },
  action: any,
) => {
  switch (action.type) {
    case "reset":
      return {};
    case "success":
      state[action.externalId] = { success: true };
      return state;
    case "error":
      state[action.externalId] = { success: false, error: action.error };
      return state;
  }
  return state;
};

const Sync = ({
  opened,
  onClose,
  setting,
}: {
  opened: boolean;
  onClose: CallableFunction;
  setting: Setting | null;
}) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { tasks, loadTasks, send } = useSync();
  const [success, dispatchSuccess] = useReducer(successReducer, {});

  useEffect(() => {
    loadTasks();
    dispatchSuccess({ type: "reset" });
  }, [opened, loadTasks]);

  const closeHandler = () => {
    if (!isSending) {
      onClose();
    }
  };

  const sendHandler = () => {
    setIsSending(true);
    dispatchSuccess({ type: "reset" });
    const promises = tasks.map((task) =>
      send(task)
        .then(() =>
          dispatchSuccess({ type: "success", externalId: task.external_id }),
        )
        .catch((error) =>
          dispatchSuccess({
            type: "error",
            externalId: task.external_id,
            error,
          }),
        ),
    );

    Promise.all(promises).then(() => {
      setIsSending(false);
      loadTasks();
    });
  };

  return (
    <Modal open={opened} onClose={closeHandler}>
      <StyledBox>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Send tasks to {setting?.integration}
        </Typography>
        <Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right">External Id</TableCell>
                  <TableCell align="right">Task Ids</TableCell>
                  <TableCell align="center">Success</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.ids.join("_")}>
                    <TableCell align="left">{task.desc}</TableCell>
                    <TableCell align="left">{task.date}</TableCell>
                    <TableCell align="right">
                      {formatDuration(task.duration)}
                    </TableCell>
                    <TableCell align="right">{task.external_id}</TableCell>
                    <TableCell align="right">{task.ids.join(", ")}</TableCell>
                    <TableCell align="center">
                      {success[task.external_id] === undefined ? (
                        <CloudOffIcon />
                      ) : success[task.external_id].success ? (
                        <CloudDoneIcon color="success" />
                      ) : (
                        <Tooltip title={success[task.external_id].error}>
                          <ThunderstormIcon color="error" />
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={closeHandler}
              color="secondary"
              disabled={isSending}
            >
              Close
            </Button>
            <LoadingButton
              variant="contained"
              sx={{ ml: 2 }}
              onClick={sendHandler}
              disabled={isSending}
              loading={isSending}
            >
              Send
            </LoadingButton>
          </Box>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Sync;
