import { useContext, useEffect, useState, useReducer, useMemo } from "react";
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
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import taskDataReducer from "./taskDataReducer";
import { invoke } from "@tauri-apps/api/core";
import { IntegrationLog } from "./types";
import TaskRow from "./TaskRow";

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
  const [taskData, dispatchTaskData] = useReducer(taskDataReducer, {});

  // Reset some data when the modal is opened/closed
  useEffect(() => {
    loadTasks();
    loadTasksData();
    dispatchTaskData({ type: "reset" });
    setTasksSent(false);

    activeIntegrations.forEach((int) =>
      tasks.forEach((tsk) => {
        dispatchTaskData({ type: "init", id: tsk.id, integrationId: int.id });
        invoke("integration_log", {
          taskId: tsk.id,
          integrationId: int.id,
        }).then((resp) => {
          if (resp) {
            dispatchTaskData({
              type: "setExternalId",
              id: tsk.id,
              integrationId: int.id,
              externalId: (resp as IntegrationLog).external_id,
            });
          } else {
            dispatchTaskData({
              type: "stopLoading",
              id: tsk.id,
              integrationId: int.id,
            });
          }
        });
      }),
    );
  }, [opened, loadTasks]);

  // The modal cannot been closes if tasks are being sent
  const closeHandler = () => {
    if (!isSending) {
      onClose();
    }
  };

  // Handler to send tasks to the integration
  const sendHandler = () => {
    setIsSending(true);
    const promises: Promise<void>[] = [];

    tasks.map((task) =>
      activeIntegrations.map((int) => {
        dispatchTaskData({
          type: "setSending",
          id: task.id,
          integrationId: int.id,
        });
        promises.push(
          send(
            task.id,
            int.id as number,
            taskData[task.id][int.id as number].externalId,
          )
            .then(() => {
              dispatchTaskData({
                type: "setSuccess",
                id: task.id,
                integrationId: int.id,
              });
            })
            .catch((err) => {
              dispatchTaskData({
                type: "setError",
                id: task.id,
                integrationId: int.id,
                errorMessage: JSON.parse(err),
              });
            }),
        );
      }),
    );

    // When all tasks are sent, refresh the tasks list
    Promise.all(promises).then(() => {
      console.log("All tasks sent");
      setIsSending(false);
      refreshTasks();
    });
  };

  const formValid = useMemo(() => {
    let valid = true;

    if (activeIntegrations.length == 0) {
      return false;
    }

    // TODO: add a flag in taskData
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
                  <TaskRow
                    key={task.id}
                    task={task}
                    activeIntegrations={activeIntegrations}
                    taskData={taskData}
                    dispatchTaskData={dispatchTaskData}
                  />
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
