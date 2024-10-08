import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../../components/Settings/Provider";
import GenericSyncModal from "../../components/Sync/GenericSyncModal";
import Alert from "@mui/material/Alert";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import RedmineActivitySelect from "./RedmineActivitySelect";
import CircularProgress from "@mui/material/CircularProgress";
import useRedmine from "./useRedmine";
import { SyncTask } from "../../hooks/useSync";
import { SyncProps } from "../../components/Sync/types";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Tooltip from "@mui/material/Tooltip";

const SyncModal = (props: SyncProps) => {
  const { opened, tasks, success, updateTaskExtraParam, setDisableSend } =
    props;

  const settingContext = useContext(SettingsContext);
  const { activities, projectActivities, loadRedmineProjectActivities } =
    useRedmine();
  const [loadingActivities, setLoadingActivities] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      // Load the project activities for each task
      if (
        opened &&
        tasks.length &&
        !loadingActivities &&
        Object.keys(projectActivities).length === 0
      ) {
        setDisableSend(true);
        setLoadingActivities(true);
        const uniqueExternalIds = Object.keys(
          tasks.reduce((acc: { [key: string]: boolean }, task: SyncTask) => {
            acc[task.external_id] = true;
            return acc;
          }, {}),
        );

        const activitiesPromises: Array<Promise<void>> = uniqueExternalIds
          .filter((externalId) => projectActivities[externalId] === undefined)
          .map((externalId) => loadRedmineProjectActivities(externalId));

        Promise.all(activitiesPromises).then(() => {
          setDisableSend(false);
        });

        setLoadingActivities(false);
      }
    });
  }, [
    opened,
    tasks,
    projectActivities,
    loadRedmineProjectActivities,
    loadingActivities,
    setLoadingActivities,
  ]);

  useEffect(() => {
    // Set the default activity for redmine tasks
    const defaultActivityName = activities.find(
      (act) =>
        act.id.toString() ===
        settingContext.setting?.integration_config["default_activity"],
    )?.name;

    if (defaultActivityName) {
      tasks.forEach((task) => {
        if (
          !task.extra_param &&
          projectActivities[task.external_id]?.activities
        ) {
          const act = projectActivities[task.external_id].activities.find(
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
    if (updateTaskExtraParam && setDisableSend) {
      updateTaskExtraParam(task.id, activity);
      setDisableSend(false);
    }
  };

  const renderHeader = () => {
    if (settingContext.setting?.integration_config["default_activity"]) {
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
            activities={projectActivities[task.external_id]?.activities || []}
            disabled={
              !projectActivities[task.external_id]?.activities ||
              success[task.id]?.success ||
              projectActivities[task.external_id]?.error ||
              projectActivities[task.external_id]?.loading
            }
            value={task.extra_param}
            onChange={(val: string) => handleChangeActivity(task, val)}
          />
          {projectActivities[task.external_id]?.loading && (
            <CircularProgress size={20} sx={{ ml: 2 }} />
          )}
          {projectActivities[task.external_id]?.error && (
            <Tooltip title="Non-existent external id">
              <ReportProblemIcon color="error" sx={{ ml: 2 }} />
            </Tooltip>
          )}
        </Box>
      </TableCell>
    );
  };

  return (
    <GenericSyncModal
      slotHeader={renderHeader()}
      slotTableHeader={<TableCell align="center">Activity</TableCell>}
      slotTableRow={renderRow}
      {...props}
    />
  );
};

export default SyncModal;
