import Chronological from "./Chronological";
import Grouped from "./Grouped";
import type { ViewType } from "../../hooks/useSettings";

const TasksTable = ({ viewType }: { viewType: ViewType | undefined }) => {
  return viewType === "Grouped" ? <Grouped /> : <Chronological />;
};

export default TasksTable;
