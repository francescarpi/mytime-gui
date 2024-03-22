import Chronological from "./Chronological";
import Grouped from "./Grouped";

const TasksTable = ({
  viewType,
}: {
  viewType: "Grouped" | "Chronological" | undefined;
}) => {
  return viewType === "Grouped" ? <Grouped /> : <Chronological />;
};

export default TasksTable;
