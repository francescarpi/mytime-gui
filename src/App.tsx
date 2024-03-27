import { useState, useRef, useReducer } from "react";
import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { formatDuration } from "./utils/dates";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import DateSelector from "./components/DateSelector";
import ViewTypeSelector from "./components/ViewTypeSelector";
import AddTaskForm from "./components/AddTaskForm";
import TaskEdition from "./components/TaskEdition";
import Sync from "./components/Sync";
import { SettingsProvider } from "./providers/SettingsProvider";

import useDate from "./hooks/useDate";
import useKeyboard from "./hooks/useKeyboard";
import useTasks, { Task } from "./hooks/useTasks";
import useSearch from "./hooks/useSearch";
import appTheme from "./styles/theme";

const defaultAddTaskValuesReducer = (
  state: { proj: string; desc: string; extId: string },
  action: any,
) => {
  switch (action.type) {
    case "setProj":
      return { ...state, proj: action.value };
    case "setDesc":
      return { ...state, desc: action.value };
    case "setExtId":
      return { ...state, extId: action.value };
    case "reset":
      return { proj: "", desc: "", extId: "" };
  }
  return state;
};

const iniAddTaskValues = { proj: "", desc: "", extId: "" };

const App = () => {
  const [openSync, setOpenSync] = useState<boolean>(false);

  const [themePreview, setThemePreview] = useState<string | null>(null);

  const [theme, setTheme] = useState<string>("#1976d2");

  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [viewModeGrouped, setViewModeGrouped] = useState<boolean>(false);

  const [defaultAddTaskValues, dispatchDefaultAddTaskValues] = useReducer(
    defaultAddTaskValuesReducer,
    iniAddTaskValues,
  );

  const searchInputRef = useRef<HTMLInputElement | null>(null);

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
    refresh,
  } = useTasks(date, setToday);

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { setQuery, totalWorked, result, setResult } = useSearch({});

  const defaultTheme = appTheme(darkMode, theme, themePreview);

  useKeyboard(setPreviousDate, setNextDate, setToday, searchInputRef);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <SettingsProvider
        setThemePreview={setThemePreview}
        refreshTasks={refresh}
        setTheme={setTheme}
        setDarkMode={setDarkMode}
        setViewModeGrouped={setViewModeGrouped}
      >
        <SnackbarProvider maxSnack={2}>
          <ConfirmProvider>
            <Sync
              opened={openSync}
              onClose={() => setOpenSync(false)}
              refreshTasks={refresh}
            />
            <TaskEdition
              task={taskToEdit}
              onClose={() => setTaskToEdit(null)}
              onEdit={editTask}
            />
            <Layout
              summary={summary}
              onPressSync={() => setOpenSync(true)}
              setSearchQuery={setQuery}
              setSearchResult={setResult}
              searchInputRef={searchInputRef}
            >
              <AddTaskForm
                sx={{ mb: 2 }}
                onSubmit={addTask}
                defaultAddTaskValues={defaultAddTaskValues}
                dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
              />
              <Card variant="outlined">
                <CardContent>
                  {result.length ? (
                    <Typography sx={{ mb: 2 }} variant="h6">
                      {result.length} tasks found ({formatDuration(totalWorked)}
                      )
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
                      <ViewTypeSelector />
                    </Grid>
                  )}
                  <TasksTable
                    tasks={result.length ? result : tasks}
                    groupedTasks={groupedTasks}
                    addTask={addTask}
                    stopTask={stopTask}
                    copyToClipboard={copyToClipboard}
                    deleteTask={deleteTask}
                    setTaskToEdit={setTaskToEdit}
                    dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                  />
                </CardContent>
              </Card>
            </Layout>
          </ConfirmProvider>
        </SnackbarProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;
