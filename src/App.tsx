import { useState, useRef, useReducer } from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import AddTaskForm from "./components/AddTaskForm";
import TaskEdition from "./components/TaskEdition";
import Sync from "./components/Sync/Sync";
import { SettingsProvider } from "./providers/SettingsProvider";

import useDate from "./hooks/useDate";
import useKeyboard from "./hooks/useKeyboard";
import useTasks, { Task } from "./hooks/useTasks";
import useSearch from "./hooks/useSearch";
import appTheme from "./styles/theme";
import useClipboard from "./hooks/useClipboard";
import useVersion from "./hooks/useVersion";
import useFavorites from "./hooks/useFavourites";
import useRedmine from "./hooks/useRedmine";
import TasksTableActionsHeader from "./components/TasksTableActionsHeader";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Favourites from "./components/Favourites";

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

  const [openFavorites, setOpenFavorites] = useState<boolean>(false);

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
    deleteTask,
    editTask,
    summary,
    refresh,
  } = useTasks(date, setToday);

  const { toggleFavourite, favourites, loadFavorites } = useFavorites(refresh);

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { setQuery, totalWorked, result, setResult, searchMode } = useSearch(
    {},
  );

  const defaultTheme = appTheme(darkMode, theme, themePreview);

  useKeyboard(setPreviousDate, setNextDate, setToday, searchInputRef);

  const { copyTask, copyTasks } = useClipboard();

  const { urlNewVersion, version } = useVersion();

  const {
    activities: redmineActivities,
    loadRedmineActivities,
    projectActivities,
    loadProjectActivities,
  } = useRedmine();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <SettingsProvider
        setThemePreview={setThemePreview}
        refreshTasks={refresh}
        setTheme={setTheme}
        setDarkMode={setDarkMode}
        setViewModeGrouped={setViewModeGrouped}
        redmineActivities={redmineActivities}
        loadRedmineActivities={loadRedmineActivities}
      >
        <SnackbarProvider
          maxSnack={2}
          autoHideDuration={5000}
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
          <ConfirmProvider>
            <Sync
              opened={openSync}
              onClose={() => setOpenSync(false)}
              refreshTasks={refresh}
              redmineActivities={redmineActivities}
              projectActivities={projectActivities}
              loadProjectActivities={loadProjectActivities}
            />
            <Favourites
              opened={openFavorites}
              onClose={() => setOpenFavorites(false)}
              favourites={favourites}
              load={loadFavorites}
              addTask={addTask}
              toggleFavourite={toggleFavourite}
            />
            <TaskEdition
              task={taskToEdit}
              onClose={() => setTaskToEdit(null)}
              onEdit={editTask}
            />
            <Layout
              summary={summary}
              onPressSync={() => setOpenSync(true)}
              onPressFavourites={() => setOpenFavorites(true)}
              setSearchQuery={setQuery}
              setSearchResult={setResult}
              searchInputRef={searchInputRef}
              urlNewVersion={urlNewVersion}
              version={version}
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
                  />
                  <TasksTable
                    searchMode={searchMode}
                    tasks={searchMode ? result : tasks}
                    groupedTasks={groupedTasks}
                    addTask={addTask}
                    stopTask={stopTask}
                    copyToClipboard={copyTask}
                    deleteTask={deleteTask}
                    setTaskToEdit={setTaskToEdit}
                    dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
                    toggleFavourite={toggleFavourite}
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
