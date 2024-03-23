import Chronological from "./Chronological";
import Grouped from "./Grouped";
import type { ViewType } from "../../hooks/useSettings";
import { Task } from "../../hooks/useTasks";

const TasksTable = ({
  viewType,
  tasks,
  groupedTasks,
  addTask,
  stopTask,
  copyToClipboard,
  deleteTask,
}: {
  viewType: ViewType | undefined;
  tasks: Task[];
  groupedTasks: Task[];
  addTask: CallableFunction;
  stopTask: CallableFunction;
  copyToClipboard: CallableFunction;
  deleteTask: CallableFunction;
}) => {
  return viewType === "Grouped" ? (
    <Grouped
      tasks={groupedTasks}
      addTask={addTask}
      stopTask={stopTask}
      copyToClipboard={copyToClipboard}
      deleteTask={deleteTask}
    />
  ) : (
    <Chronological
      tasks={tasks}
      addTask={addTask}
      stopTask={stopTask}
      copyToClipboard={copyToClipboard}
      deleteTask={deleteTask}
    />
  );
};

export default TasksTable;
