import { useContext } from "react";

import { Box } from "@mui/material";

import Chronological from "./Chronological";
import Grouped from "./Grouped";
import { Task } from "../../hooks/useTasks";
import { SettingsContext } from "../Settings/Provider";
import { ViewType } from "../../hooks/useSettings";

const TasksTable = ({
  tasks,
  groupedTasks,
  addTask,
  stopTask,
  copyToClipboard,
  deleteTask,
  setTaskToEdit,
  dispatchDefaultAddTaskValues,
  searchMode,
  toggleFavourite,
  copyStringToClipboard,
  setQuery,
}: {
  tasks: Task[];
  groupedTasks: Task[];
  addTask: CallableFunction;
  stopTask: CallableFunction;
  copyToClipboard: CallableFunction;
  deleteTask: CallableFunction;
  setTaskToEdit: CallableFunction;
  dispatchDefaultAddTaskValues: CallableFunction;
  searchMode: boolean;
  toggleFavourite: CallableFunction;
  copyStringToClipboard: CallableFunction;
  setQuery: CallableFunction;
}) => {
  const settingsContext = useContext(SettingsContext);
  const isViewGrouped = settingsContext.setting?.view_type === ViewType.Grouped;
  const props = {
    tasks: isViewGrouped && !searchMode ? groupedTasks : tasks,
    addTask,
    stopTask,
    copyToClipboard,
    deleteTask,
    setTaskToEdit,
    dispatchDefaultAddTaskValues,
    toggleFavourite,
    copyStringToClipboard,
    setQuery,
  };
  return (
    <Box
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        height: 350,
      }}
    >
      {isViewGrouped && !searchMode ? (
        <Grouped {...props} />
      ) : (
        <Chronological {...props} />
      )}
    </Box>
  );
};

export default TasksTable;
