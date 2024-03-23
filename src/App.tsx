import Grid from "@mui/material/Grid";
import { Card, CardContent } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";

import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import DateSelector from "./components/DateSelector";
import ViewTypeSelector from "./components/ViewTypeSelector";
import AddTaskForm from "./components/AddTaskForm";

import useSettings from "./hooks/useSettings";
import useDate from "./hooks/useDate";
// import useKeyboard from "./hooks/useKeyboard";
import useTasks from "./hooks/useTasks";

const App = () => {
  const { isIntegrationValid, setting, changeViewType } = useSettings();
  const { date, setDate, setPreviousDate, setNextDate } = useDate();
  const {
    tasks,
    groupedTasks,
    addTask,
    stopTask,
    copyToClipboard,
    deleteTask,
  } = useTasks(date);
  // const {} = useKeyboard();

  return (
    <ConfirmProvider>
      <Layout showSendTasksIcon={isIntegrationValid}>
        <AddTaskForm sx={{ mb: 2 }} onSubmit={addTask} />
        <Card variant="outlined">
          <CardContent>
            <Grid container sx={{ mb: 2 }}>
              <DateSelector
                setPrevious={setPreviousDate}
                setNext={setNextDate}
                date={date}
                onChange={setDate}
                sx={{ flexGrow: 1 }}
              />
              <ViewTypeSelector
                viewType={setting?.view_type}
                changeViewType={changeViewType}
              />
            </Grid>
            <TasksTable
              viewType={setting?.view_type}
              tasks={tasks}
              groupedTasks={groupedTasks}
              addTask={addTask}
              stopTask={stopTask}
              copyToClipboard={copyToClipboard}
              deleteTask={deleteTask}
            />
          </CardContent>
        </Card>
      </Layout>
    </ConfirmProvider>
  );
};

export default App;
