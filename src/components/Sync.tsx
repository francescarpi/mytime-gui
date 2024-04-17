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
import { RedmineActivity } from "../hooks/useRedmine";
import RedmineActivitySelect from "./RedmineActivitySelect";
import Alert from "@mui/material/Alert";

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
      return { ...state, [action.id]: { sending: true } };
    case "success":
      return { ...state, [action.id]: { success: true, sending: false } };
    case "error":
      return {
        ...state,
        [action.id]: { success: false, error: action.error, sending: false },
      };
  }
  return state;
};

const Sync = ({
  opened,
  onClose,
  refreshTasks,
  redmineActivities,
  projectActivities,
  loadProjectActivities,
}: {
  opened: boolean;
  onClose: CallableFunction;
  refreshTasks: CallableFunction;
  redmineActivities: RedmineActivity[];
  projectActivities: { [key: string]: RedmineActivity[] };
  loadProjectActivities: CallableFunction;
}) => {
  const settingContext = useContext(SettingsContext);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { tasks, loadTasks, send, updateTaskExtraParam } = useSync();
  const [success, dispatchSuccess] = useReducer(successReducer, {});
  const [tasksSent, setTasksSent] = useState<boolean>(false);

  useEffect(() => {
    loadTasks();
    dispatchSuccess({ type: "reset" });
    setTasksSent(false);
  }, [opened, loadTasks]);

  useEffect(() => {
    if (opened && tasks.length) {
      tasks.forEach((task) => {
        if (projectActivities[task.external_id] === undefined) {
          loadProjectActivities(task.external_id);
        }
      });
    }
  }, [opened, tasks, projectActivities, loadProjectActivities]);

  const closeHandler = () => {
    if (!isSending) {
      onClose();
    }
  };

  const sendHandler = () => {
    setIsSending(true);
    dispatchSuccess({ type: "reset" });

    const promises = tasks.map(async (task) => {
      dispatchSuccess({ type: "sending", id: task.id });
      return send(task.id, task.extra_param)
        .then(() => dispatchSuccess({ type: "success", id: task.id }))
        .catch((error) => {
          console.log(error);
          dispatchSuccess({
            type: "error",
            id: task.id,
            error,
          });
        });
    });

    Promise.all(promises).then(() => {
      setIsSending(false);
      setTasksSent(true);
      refreshTasks();
    });
  };

  const renderIcon = (task: SyncTask) => {
    if (success[task.id] === undefined) {
      return <CloudOffIcon />;
    }

    if (success[task.id].sending) {
      return <CircularProgress size={20} />;
    }

    if (success[task.id].success) {
      return <CloudDoneIcon color="success" />;
    }

    return (
      <Tooltip title={success[task.id].error}>
        <ThunderstormIcon color="error" />
      </Tooltip>
    );
  };

  const handleChangeActivity = (task: SyncTask, activity: string) => {
    updateTaskExtraParam(task.id, activity);
    setTasksSent(false);
  };

  if (!opened) {
    return null;
  }

  return (
    <Modal open={opened} onClose={closeHandler}>
      <StyledBox width={1000}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Send tasks to {settingContext.setting?.integration}
        </Typography>
        <Box>
          {settingContext.setting?.integration === "Redmine" &&
            !settingContext.setting?.integration_extra_param && (
              <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
                Go to Settings -&gt; Integrations and set a default activity for
                redmine.
              </Alert>
            )}
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
                  {settingContext.setting?.integration === "Redmine" && (
                    <TableCell align="center">Activity</TableCell>
                  )}
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
                    {settingContext.setting?.integration === "Redmine" && (
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <RedmineActivitySelect
                            size="small"
                            activities={
                              projectActivities[task.external_id] || []
                            }
                            disabled={!projectActivities[task.external_id]}
                            value={task.extra_param}
                            onChange={(val: string) =>
                              handleChangeActivity(task, val)
                            }
                          />
                          {!projectActivities[task.external_id] && (
                            <CircularProgress size={20} sx={{ ml: 2 }} />
                          )}
                        </Box>
                      </TableCell>
                    )}
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
