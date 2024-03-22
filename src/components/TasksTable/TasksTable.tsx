import Chronological from "./Chronological";
import Grouped from "./Grouped";
import type { ViewType } from "../../hooks/useSettings";
import { Task } from "../../hooks/useTasks";

const TasksTable = ({
  viewType,
  tasks,
  groupedTasks,
}: {
  viewType: ViewType | undefined;
  tasks: Task[];
  groupedTasks: Task[];
}) => {
  return viewType === "Grouped" ? (
    <Grouped tasks={groupedTasks} />
  ) : (
    <Chronological tasks={tasks} />
  );
};

export default TasksTable;
