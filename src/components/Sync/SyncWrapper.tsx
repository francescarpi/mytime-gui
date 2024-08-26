import {
  useContext,
  createElement,
  useEffect,
  useState,
  useReducer,
} from "react";

import { SettingsContext } from "../Settings/Provider";
import { getSyncComponent } from "../../integrations";
import useSync from "../../hooks/useSync";
import { SuccessType } from "./types";

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

const SyncWrapper = ({
  opened,
  onClose,
  refreshTasks,
}: {
  opened: boolean;
  onClose: CallableFunction;
  refreshTasks: CallableFunction;
}) => {
  const { tasks, loadTasks, send, updateTaskExtraParam } = useSync();
  const [disableSend, setDisableSend] = useState<boolean>(false);
  const [disableClose, setDisableClose] = useState<boolean>(false);
  const [success, dispatchSuccess] = useReducer(successReducer, {});
  const settingContext = useContext(SettingsContext);

  // Reset some data when the modal is opened/closed
  useEffect(() => {
    loadTasks();
    dispatchSuccess({ type: "reset" });
    setDisableSend(false);
  }, [opened, loadTasks]);

  // The modal cannot been closes if tasks are being sent
  const closeHandler = () => {
    if (!disableSend) {
      onClose();
    }
  };

  // Handler to send tasks to the integration
  const sendHandler = () => {
    setDisableSend(true);
    setDisableClose(true);
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
          dispatchSuccess({
            type: "error",
            id: task.id,
            error,
          });
        });
    });

    // When all tasks are sent, refresh the tasks list
    Promise.all(promises).then(() => {
      setDisableClose(false);
      refreshTasks();
    });
  };

  return createElement(
    getSyncComponent(settingContext.setting?.integration as string),
    {
      opened,
      onClose: closeHandler,
      tasks,
      integrationName: settingContext.setting?.integration || "",
      success,
      sendHandler,
      updateTaskExtraParam,
      disableSend,
      setDisableSend,
      disableClose,
    },
  );
};

export default SyncWrapper;
