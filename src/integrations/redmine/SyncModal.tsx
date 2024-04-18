import { useContext, useEffect } from "react";
import { SettingsContext } from "../../providers/SettingsProvider";
import Sync from "../../components/Sync/Sync";
import Alert from "@mui/material/Alert";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import RedmineActivitySelect from "./RedmineActivitySelect";
import CircularProgress from "@mui/material/CircularProgress";
import useRedmine from "./useRedmine";
import { SyncTask } from "../../hooks/useSync";
import { SuccessType } from "../../components/Sync/types";

const SyncModal = ({
  opened,
  onClose,
  tasks,
  integrationName,
  success,
  isSending,
  tasksSent,
  sendHandler,
  updateTaskExtraParam,
  setTasksSent,
}: {
  opened: boolean;
  onClose: CallableFunction;
  tasks: SyncTask[];
  integrationName: string;
  success: SuccessType;
  isSending: boolean;
  tasksSent: boolean;
  sendHandler: CallableFunction;
  updateTaskExtraParam?: CallableFunction;
  setTasksSent?: CallableFunction;
}) => {
  const settingContext = useContext(SettingsContext);
  const { activities, projectActivities, loadRedmineProjectActivities } =
    useRedmine();

  // TODO: Improve the performance. Prevent call multiple times when tasks are updated
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
          loadRedmineProjectActivities(externalId);
        }
      });
    }
  }, [opened, tasks, projectActivities, loadRedmineProjectActivities]);

  useEffect(() => {
    // Set the default activity for redmine tasks
    const defaultActivityName = activities.find(
      (act) =>
        act.id.toString() === settingContext.setting?.integration_extra_param,
    )?.name;

    if (defaultActivityName) {
      tasks.forEach((task) => {
        if (!task.extra_param && projectActivities[task.external_id]) {
          const act = projectActivities[task.external_id].find(
            (act) => act.name === defaultActivityName,
          );
          if (act && updateTaskExtraParam) {
            updateTaskExtraParam(task.id, act.id.toString());
          }
        }
      });
    }
  }, [
    projectActivities,
    tasks,
    activities,
    settingContext,
    updateTaskExtraParam,
  ]);

  const handleChangeActivity = (task: SyncTask, activity: string) => {
    if (updateTaskExtraParam && setTasksSent) {
      updateTaskExtraParam(task.id, activity);
      setTasksSent(false);
    }
  };

  const renderHeader = () => {
    if (settingContext.setting?.integration_extra_param) {
      return null;
    }

    return (
      <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
        Go to Settings -&gt; Integrations to set a default Redmine activity.
      </Alert>
    );
  };

  const renderRow = (task: SyncTask) => {
    return (
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <RedmineActivitySelect
            size="small"
            activities={projectActivities[task.external_id] || []}
            disabled={
              !projectActivities[task.external_id] || success[task.id]?.success
            }
            value={task.extra_param}
            onChange={(val: string) => handleChangeActivity(task, val)}
          />
          {!projectActivities[task.external_id] && (
            <CircularProgress size={20} sx={{ ml: 2 }} />
          )}
        </Box>
      </TableCell>
    );
  };

  return (
    <Sync
      opened={opened}
      onClose={onClose}
      tasks={tasks}
      integrationName={integrationName}
      success={success}
      isSending={isSending}
      tasksSent={tasksSent}
      sendHandler={sendHandler}
      slotHeader={renderHeader()}
      slotTableHeader={<TableCell align="center">Activity</TableCell>}
      slotTableRow={renderRow}
    />
  );
};

export default SyncModal;
