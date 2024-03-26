import { useEffect, useState, useReducer, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { StyledBox } from "../styles/modal";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSync, { SyncTask } from "../hooks/useSync";
import { formatDuration } from "../utils/dates";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { SettingsContext } from "../providers/SettingsProvider";

const successReducer = (
  state: {
    [key: string]: { success?: boolean; error?: string; sending: boolean };
  },
  action: any,
) => {
  switch (action.type) {
    case "reset":
      return {};
    case "sending":
      state[action.externalId] = { sending: true };
      return state;
    case "success":
      state[action.externalId] = { success: true, sending: false };
      return state;
    case "error":
      state[action.externalId] = {
        success: false,
        error: action.error,
        sending: false,
      };
      return state;
  }
  return state;
};

const Sync = ({
  opened,
  onClose,
  refreshTasks,
}: {
  opened: boolean;
  onClose: CallableFunction;
  refreshTasks: CallableFunction;
}) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { tasks, loadTasks, send } = useSync();
  const [success, dispatchSuccess] = useReducer(successReducer, {});
  const [tasksSent, setTasksSent] = useState<boolean>(false);
  const settingContext = useContext(SettingsContext);

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

    const promises = tasks.map(async (task) => {
      dispatchSuccess({ type: "sending", externalId: task.external_id });
      return send(task)
        .then(() =>
          dispatchSuccess({ type: "success", externalId: task.external_id }),
        )
        .catch((error) =>
          dispatchSuccess({
            type: "error",
            externalId: task.external_id,
            error,
          }),
        );
    });

    Promise.all(promises).then(() => {
      setIsSending(false);
      setTasksSent(true);
      refreshTasks();
    });
  };

  const renderIcon = (task: SyncTask) => {
    if (success[task.external_id] === undefined) {
      return <CloudOffIcon />;
    }

    if (success[task.external_id].sending) {
      return <CircularProgress size={20} />;
    }

    if (success[task.external_id].success) {
      return <CloudDoneIcon color="success" />;
    }

    return (
      <Tooltip title={success[task.external_id].error}>
        <ThunderstormIcon color="error" />
      </Tooltip>
    );
  };

  return (
    <Modal open={opened} onClose={closeHandler}>
      <StyledBox>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Send tasks to {settingContext.setting?.integration}
        </Typography>
        <Box>
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
                  <TableCell align="center">Success</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.ids.join("_")}>
                    <TableCell align="left">{task.desc}</TableCell>
                    <TableCell align="left" sx={{ textWrap: "nowrap" }}>
                      {task.date}
                    </TableCell>
                    <TableCell align="right">
                      {formatDuration(task.duration)}
                    </TableCell>
                    <TableCell align="right">{task.external_id}</TableCell>
                    <TableCell align="right">{task.ids.join(", ")}</TableCell>
                    <TableCell align="center">{renderIcon(task)}</TableCell>
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
            {tasks.length > 0 && (
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={sendHandler}
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
