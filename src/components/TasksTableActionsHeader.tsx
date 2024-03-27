import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Dayjs } from "dayjs";
import { Task } from "../hooks/useTasks";
import { formatDuration } from "../utils/dates";
import CopyToClipboardBtn from "./CopyToClipboardBtn";
import DateSelector from "./DateSelector";
import ViewTypeSelector from "./ViewTypeSelector";

const TasksTableActionsHeader = ({
  searchResult,
  totalWorked,
  setPreviousDate,
  setNextDate,
  date,
  setDate,
  copyTasks,
  viewModeGrouped,
  groupedTasks,
  tasks,
}: {
  searchResult: Task[];
  totalWorked: number;
  setPreviousDate: CallableFunction;
  setNextDate: CallableFunction;
  date: Dayjs;
  setDate: CallableFunction;
  copyTasks: CallableFunction;
  viewModeGrouped: boolean;
  groupedTasks: Task[];
  tasks: Task[];
}) => {
  return searchResult.length ? (
    <Typography sx={{ mb: 2 }} variant="h6">
      {searchResult.length} tasks found ({formatDuration(totalWorked)})
    </Typography>
  ) : (
    <Grid container sx={{ mb: 2 }}>
      <DateSelector
        setPrevious={setPreviousDate}
        setNext={setNextDate}
        date={date}
        onChange={setDate}
        sx={{ flexGrow: 1 }}
      />
      <CopyToClipboardBtn
        onClick={() =>
          copyTasks({
            tasks: viewModeGrouped ? groupedTasks : tasks,
          })
        }
        tooltip="Copy all visible tasks to the clipboard as a list"
        sx={{ mr: 2 }}
      />
      <ViewTypeSelector />
    </Grid>
  );
};
export default TasksTableActionsHeader;
