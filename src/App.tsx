import { useState, useRef, useReducer } from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import AddTaskForm from "./components/AddTaskForm";
import TaskEdition from "./components/TaskEdition";
import SyncModal from "./components/Sync/SyncModal";
import { SettingsProvider } from "./providers/SettingsProvider";

import useDate from "./hooks/useDate";
import useKeyboard from "./hooks/useKeyboard";
import useTasks, { Task } from "./hooks/useTasks";
import useSearch from "./hooks/useSearch";
import appTheme from "./styles/theme";
import useClipboard from "./hooks/useClipboard";
import useVersion from "./hooks/useVersion";
import useFavorites from "./hooks/useFavourites";

import TasksTableActionsHeader from "./components/TasksTableActionsHeader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Favourites from "./components/Favourites";
import { defaultAddTaskValuesReducer, themeReducer } from "./reducers";

const App = () => {
  const [openSync, setOpenSync] = useState<boolean>(false);

  const [theme, dispatchTheme] = useReducer(themeReducer, {
    primary: "#1976d2",
    secondary: "#ce93d8",
    primaryPreview: null,
    secondaryPreview: null,
  });
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const defaultTheme = appTheme(darkMode, theme);

  const [viewModeGrouped, setViewModeGrouped] = useState<boolean>(false);

  const [defaultAddTaskValues, dispatchDefaultAddTaskValues] = useReducer(
    defaultAddTaskValuesReducer,
    { proj: "", desc: "", extId: "" },
  );

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { date, setDate, setPreviousDate, setNextDate, setToday } = useDate();

  const { setQuery, totalWorked, result, searchMode } = useSearch({});

  const {
    tasks,
    groupedTasks,
    addTask,
    stopTask,
    deleteTask,
    editTask,
    summary,
    refresh,
  } = useTasks(date, setToday);

  const { toggleFavourite, favourites, loadFavorites } = useFavorites(refresh);

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useKeyboard(setPreviousDate, setNextDate, setToday, searchInputRef);

  const { copyTask, copyTasks, copyString } = useClipboard();

  const { newVersion, version } = useVersion();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <ConfirmProvider
        defaultOptions={{
          confirmationButtonProps: { variant: "contained" },
          cancellationButtonProps: {
            variant: "contained",
            color: "secondary",
          },
        }}
      >
        <SettingsProvider
          refreshTasks={refresh}
          dispatchTheme={dispatchTheme}
          setDarkMode={setDarkMode}
          setViewModeGrouped={setViewModeGrouped}
        >
          <SnackbarProvider
            maxSnack={2}
            autoHideDuration={5000}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          >
            <SyncModal
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
              setToday={setToday}
              summary={summary}
              onPressSync={() => setOpenSync(true)}
              setSearchQuery={setQuery}
              searchInputRef={searchInputRef}
              newVersion={newVersion}
              version={version}
              rightSideBarContent={
                <Favourites
                  favourites={favourites}
                  load={loadFavorites}
                  addTask={addTask}
                  toggleFavourite={toggleFavourite}
                />
              }
            >
              <AddTaskForm
                sx={{ mb: 2 }}
                onSubmit={addTask}
                defaultAddTaskValues={defaultAddTaskValues}
                dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
              />
              <Card variant="outlined">
                <CardContent>
                  <TasksTableActionsHeader
                    searchResult={result}
                    totalWorked={totalWorked}
                    setPreviousDate={setPreviousDate}
                    setNextDate={setNextDate}
                    date={date}
                    setDate={setDate}
                    copyTasks={copyTasks}
                    viewModeGrouped={viewModeGrouped}
                    groupedTasks={groupedTasks}
                    tasks={tasks}
                    setQuery={setQuery}
                  />
                  <TasksTable
                    searchMode={searchMode}
                    tasks={searchMode ? result : tasks}
                    groupedTasks={groupedTasks}
                    addTask={addTask}
                    stopTask={stopTask}
                    copyToClipboard={copyTask}
                    copyStringToClipboard={copyString}
                    deleteTask={deleteTask}
                    setTaskToEdit={setTaskToEdit}
                    dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                    toggleFavourite={toggleFavourite}
                    setQuery={setQuery}
                  />
                </CardContent>
              </Card>
            </Layout>
          </SnackbarProvider>
        </SettingsProvider>
      </ConfirmProvider>
    </ThemeProvider>
  );
};

export default App;
