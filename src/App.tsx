import { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Card, CardContent } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import DateSelector from "./components/DateSelector";
import ViewTypeSelector from "./components/ViewTypeSelector";
import AddTaskForm from "./components/AddTaskForm";
import TaskEdition from "./components/TaskEdition";

import useSettings from "./hooks/useSettings";
import useDate from "./hooks/useDate";
// import useKeyboard from "./hooks/useKeyboard";
import useTasks, { Task } from "./hooks/useTasks";

const App = () => {
  const { isIntegrationValid, setting, changeViewType, toggleDarkMode } =
    useSettings();
  const { date, setDate, setPreviousDate, setNextDate } = useDate();
  // const {} = useKeyboard();
  const {
    tasks,
    groupedTasks,
    addTask,
    stopTask,
    copyToClipboard,
    deleteTask,
    editTask,
    summary,
  } = useTasks(date);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // TODO: Improve dark theme
  const darkTheme = createTheme({
    palette: {
      mode: setting?.dark_mode ? "dark" : "light",
    },
  });

  if (!setting) {
    return <Box sx={{ p: 4 }}>Loading...</Box>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <ConfirmProvider>
        <TaskEdition
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onEdit={editTask}
        />
        <Layout
          showSendTasksIcon={isIntegrationValid}
          summary={summary}
          setting={setting}
          onToggleDarkMode={toggleDarkMode}
        >
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
                setTaskToEdit={setTaskToEdit}
              />
            </CardContent>
          </Card>
        </Layout>
      </ConfirmProvider>
    </ThemeProvider>
  );
};

export default App;
