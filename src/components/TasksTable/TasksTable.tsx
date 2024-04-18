import { useContext } from "react";
import Chronological from "./Chronological";
import Grouped from "./Grouped";
import Box from "@mui/material/Box";
import { Task } from "../../hooks/useTasks";
import { SettingsContext } from "../../providers/SettingsProvider";
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
}) => {
  const settingsContext = useContext(SettingsContext);
  return (
    <Box
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        height: 350,
      }}
    >
      {settingsContext.setting?.view_type === ViewType.Grouped &&
      !searchMode ? (
        <Grouped
          tasks={groupedTasks}
          addTask={addTask}
          stopTask={stopTask}
          copyToClipboard={copyToClipboard}
          deleteTask={deleteTask}
          setTaskToEdit={setTaskToEdit}
          dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
          toggleFavourite={toggleFavourite}
        />
      ) : (
        <Chronological
          tasks={tasks}
          addTask={addTask}
          stopTask={stopTask}
          copyToClipboard={copyToClipboard}
          deleteTask={deleteTask}
          setTaskToEdit={setTaskToEdit}
          dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
          toggleFavourite={toggleFavourite}
        />
      )}
    </Box>
  );
};

export default TasksTable;
