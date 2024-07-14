import { useContext, useEffect, useState, useReducer, useMemo } from "react";
import * as React from "react";
import { SettingsContext } from "../../providers/SettingsProvider";
import useSync from "../../hooks/useSync";
import Modal from "@mui/material/Modal";
import { StyledBox } from "../../styles/modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatDuration } from "../../utils/dates";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TaskIcon from "./TaskIcon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { successReducer, taskDataReducer } from "./reducers";

const SyncModal = ({
  opened,
  onClose,
  refreshTasks,
}: {
  opened: boolean;
  onClose: CallableFunction;
  refreshTasks: CallableFunction;
}) => {
  const settingContext = useContext(SettingsContext);
  const { activeIntegrations } = settingContext;

  const { tasks, loadTasks, send, loadTasksData } = useSync(activeIntegrations);
  const [tasksSent, setTasksSent] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [success, dispatchSuccess] = useReducer(successReducer, {});
  const [taskData, dispatchTaskData] = useReducer(taskDataReducer, {});

  // Reset some data when the modal is opened/closed
  useEffect(() => {
    loadTasks();
    loadTasksData();
    dispatchSuccess({ type: "reset" });
    dispatchTaskData({ type: "reset" });
    setTasksSent(false);
  }, [opened, loadTasks]);

  // The modal cannot been closes if tasks are being sent
  const closeHandler = () => {
    if (!isSending) {
      onClose();
    }
  };

  // Handler to send tasks to the integration
  const sendHandler = () => {
    // setIsSending(true);

    dispatchSuccess({ type: "reset" });

    const promises: Promise<void>[] = [];

    tasks.map((task) =>
      activeIntegrations.map((int) => {
        promises.push(
          send(
            task.id,
            int.id as number,
            taskData[task.id][int.id as number].externalId,
          ),
        );
      }),
    );

    // const promises = tasks.map(async (task) => {
    //   if (success[task.id] && success[task.id].success) {
    //     dispatchSuccess({ type: "success", id: task.id });
    //     return;
    //   }
    //
    //   dispatchSuccess({ type: "sending", id: task.id });
    //
    //   return send(task.id)
    //     .then(() => dispatchSuccess({ type: "success", id: task.id }))
    //     .catch((error) => {
    //       console.log(error);
    //       dispatchSuccess({
    //         type: "error",
    //         id: task.id,
    //         error,
    //       });
    //     });
    // });
    //
    // // When all tasks are sent, refresh the tasks list
    // Promise.all(promises).then(() => {
    //   setIsSending(false);
    //   setTasksSent(true);
    //   refreshTasks();
    // });
  };

  const formValid = useMemo(() => {
    let valid = true;

    if (activeIntegrations.length == 0) {
      return false;
    }

    activeIntegrations.forEach((int) =>
      tasks.forEach((tsk) => {
        if (!taskData[tsk.id]?.[int.id as number]?.externalId) {
          valid = false;
        }
      }),
    );
    return valid;
  }, [taskData]);

  return (
    <Modal open={opened} onClose={() => onClose()}>
      <StyledBox width={1000}>
        <Typography variant="h5">Send tasks to integations</Typography>
        <Box>
          {tasks.length === 0 && (
            <Alert severity="warning" variant="outlined" sx={{ mb: 2, mt: 2 }}>
              No tasks to send. Only finished tasks can be reported.
            </Alert>
          )}
          {activeIntegrations.length === 0 && (
            <Alert severity="warning" variant="outlined" sx={{ mb: 2, mt: 2 }}>
              No active integrations defined. Please, go to settintgs and set or
              active at least one integration.
            </Alert>
          )}
          <TableContainer sx={{ maxHeight: 350 }} component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                    Task Ids
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell align="left">
                        [{task.project}] {task.desc}
                      </TableCell>
                      <TableCell align="left">{task.date}</TableCell>
                      <TableCell align="right">
                        {formatDuration(task.duration)}
                      </TableCell>
                      <TableCell align="right">{task.ids.join(", ")}</TableCell>
                    </TableRow>
                    <TableRow sx={{ paddingY: 0 }}>
                      <TableCell colSpan={4}>
                        <Grid container spacing={2}>
                          {activeIntegrations.map((int) => (
                            <Grid
                              item
                              md={activeIntegrations.length === 1 ? 12 : 6}
                              key={`int_${int.id}`}
                            >
                              <Card variant="outlined">
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography>
                                      {int.name || int.itype}
                                    </Typography>
                                    <TaskIcon task={task} success={success} />
                                  </Box>
                                  <Box sx={{ mt: "1rem" }}>
                                    <TextField
                                      error={
                                        !taskData[task.id]?.[int.id as number]
                                          ?.externalId
                                      }
                                      label="External Id"
                                      size="small"
                                      fullWidth
                                      value={
                                        taskData[task.id]?.[int.id as number]
                                          ?.externalId || ""
                                      }
                                      onChange={(e) =>
                                        dispatchTaskData({
                                          type: "setExternalId",
                                          id: task.id,
                                          integrationId: int.id,
                                          externalId: e.target.value,
                                        })
                                      }
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <IconButton
                                              size="small"
                                              onClick={() => {}}
                                            >
                                              <SearchIcon />
                                            </IconButton>
                                          </InputAdornment>
                                        ),
                                      }}
                                      inputProps={{
                                        autoComplete: "off",
                                        autoCorrect: "off",
                                        autoCapitalize: "off",
                                        spellCheck: "false",
                                        maxLength: 50,
                                      }}
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
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
                disabled={isSending || tasksSent || !formValid}
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

export default SyncModal;
