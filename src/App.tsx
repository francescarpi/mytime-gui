import { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { formatDuration } from "./utils/dates";
import CssBaseline from "@mui/material/CssBaseline";

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
import useKeyboard from "./hooks/useKeyboard";
import useTasks, { Task } from "./hooks/useTasks";
import useSearch from "./hooks/useSearch";

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
  const { date, setDate, setPreviousDate, setNextDate, setToday } = useDate();
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
  const { query, setQuery, totalWorked, result } = useSearch();

  useKeyboard(setPreviousDate, setNextDate, setToday);

  const darkTheme = createTheme({
    palette: {
      mode: setting?.dark_mode ? "dark" : "light",
      primary: {
        main: setting?.theme || "#1976d2",
      },
    },
  });

  if (!setting) {
    return <Box sx={{ p: 4 }}>Loading...</Box>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
            searchQuery={query}
            setSearchQuery={setQuery}
          >
            <AddTaskForm sx={{ mb: 2 }} onSubmit={addTask} />
            <Card variant="outlined">
              <CardContent>
                {result.length ? (
                  <Typography sx={{ mb: 2 }} variant="h6">
                    {result.length} tasks found ({formatDuration(totalWorked)})
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
                    <ViewTypeSelector
                      viewType={setting?.view_type}
                      changeViewType={changeViewType}
                    />
                  </Grid>
                )}
                <TasksTable
                  viewType={
                    result.length ? "Chronological" : setting?.view_type
                  }
                  tasks={result.length ? result : tasks}
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
