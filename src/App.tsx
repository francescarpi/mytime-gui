import { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Card, CardContent } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";

import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import DateSelector from "./components/DateSelector";
import ViewTypeSelector from "./components/ViewTypeSelector";
import AddTaskForm from "./components/AddTaskForm";
import TaskEdition from "./components/TaskEdition";
import Settings from "./components/Settings/Settings";
import Sync from "./components/Sync";

import useSettings from "./hooks/useSettings";
import useDate from "./hooks/useDate";
// import useKeyboard from "./hooks/useKeyboard";
import useTasks, { Task } from "./hooks/useTasks";

const App = () => {
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [openSync, setOpenSync] = useState<boolean>(false);
  const {
    isIntegrationValid,
    setting,
    changeViewType,
    toggleDarkMode,
    saveSettings,
  } = useSettings();
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
      <SnackbarProvider maxSnack={2}>
        <ConfirmProvider>
          <Sync
            opened={openSync}
            onClose={() => setOpenSync(false)}
            setting={setting}
          />
          <Settings
            opened={openSettings}
            onClose={() => setOpenSettings(false)}
            setting={setting}
            saveSetting={saveSettings}
          />
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
            onPressSettings={() => setOpenSettings(true)}
            onPressSync={() => setOpenSync(true)}
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
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
