import Chronological from "./Chronological";
import Grouped from "./Grouped";
import Box from "@mui/material/Box";
import { Task } from "../../hooks/useTasks";
import type { ViewType } from "../../hooks/useSettings";

const TasksTable = ({
  viewType,
  tasks,
  groupedTasks,
  addTask,
  stopTask,
  copyToClipboard,
  deleteTask,
  setTaskToEdit,
}: {
  viewType: ViewType | undefined;
  tasks: Task[];
  groupedTasks: Task[];
  addTask: CallableFunction;
  stopTask: CallableFunction;
  copyToClipboard: CallableFunction;
  deleteTask: CallableFunction;
  setTaskToEdit: CallableFunction;
}) => {
  return (
    <Box
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        height: 350,
      }}
    >
      {viewType === "Grouped" ? (
        <Grouped
          tasks={groupedTasks}
          addTask={addTask}
          stopTask={stopTask}
          copyToClipboard={copyToClipboard}
          deleteTask={deleteTask}
          setTaskToEdit={setTaskToEdit}
        />
      ) : (
        <Chronological
          tasks={tasks}
          addTask={addTask}
          stopTask={stopTask}
          copyToClipboard={copyToClipboard}
          deleteTask={deleteTask}
          setTaskToEdit={setTaskToEdit}
        />
      )}
    </Box>
  );
};

export default TasksTable;
