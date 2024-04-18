import { useEffect, useState, useReducer, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { StyledBox } from "../../styles/modal";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useSync, { SyncTask } from "../../hooks/useSync";
import { formatDuration } from "../../utils/dates";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { SettingsContext } from "../../providers/SettingsProvider";
import { RedmineActivity } from "../../integrations/redmine/useRedmine";
import RedmineActivitySelect from "../../integrations/redmine/RedmineActivitySelect";
import { SuccessType } from "./types";
import TaskIcon from "./TaskIcon";

import Alert from "@mui/material/Alert";
const successReducer = (state: SuccessType, action: any) => {
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
    // When the modal is opened or closed, reset the success state
    loadTasks();
    dispatchSuccess({ type: "reset" });
    setTasksSent(false);
  }, [opened, loadTasks]);

  useEffect(() => {
    // Load the project activities for each task
    if (opened && tasks.length) {
      const uniqueExternalIds = Object.keys(
        tasks.reduce((acc: { [key: string]: boolean }, task: SyncTask) => {
          acc[task.external_id] = true;
          return acc;
        }, {}),
      );

      uniqueExternalIds.forEach((externalId) => {
        if (projectActivities[externalId] === undefined) {
          loadProjectActivities(externalId);
        }
      });
    }
  }, [opened, tasks, projectActivities, loadProjectActivities]);

  useEffect(() => {
    // Set the default activity for redmine tasks
    const defaultActivityName = redmineActivities.find(
      (act) =>
        act.id.toString() === settingContext.setting?.integration_extra_param,
    )?.name;

    if (defaultActivityName) {
      tasks.forEach((task) => {
        if (!task.extra_param && projectActivities[task.external_id]) {
          const act = projectActivities[task.external_id].find(
            (act) => act.name === defaultActivityName,
          );
          if (act) {
            updateTaskExtraParam(task.id, act.id.toString());
          }
        }
      });
    }
  }, [
    projectActivities,
    tasks,
    redmineActivities,
    settingContext,
    updateTaskExtraParam,
  ]);

  const closeHandler = () => {
    if (!isSending) {
      onClose();
    }
  };

  const sendHandler = () => {
    setIsSending(true);
    dispatchSuccess({ type: "reset" });

    const promises = tasks.map(async (task) => {
      if (success[task.id] && success[task.id].success) {
        dispatchSuccess({ type: "success", id: task.id });
        return;
      }

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
                            disabled={
                              !projectActivities[task.external_id] ||
                              success[task.id]?.success
                            }
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
