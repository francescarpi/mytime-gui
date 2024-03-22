import Grid from "@mui/material/Grid";

import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import TitleDate from "./components/TitleDate";
import DateSelector from "./components/DateSelector";
import ViewTypeSelector from "./components/ViewTypeSelector";

import useSettings from "./hooks/useSettings";
import useDate from "./hooks/useDate";
// import useKeyboard from "./hooks/useKeyboard";
import useTasks from "./hooks/useTasks";

const App = () => {
  const { isIntegrationValid, setting, changeViewType } = useSettings();
  const { date, setPreviousDate, setNextDate } = useDate();
  const { tasks, groupedTasks } = useTasks(date);
  // const {} = useKeyboard();

  return (
    <Layout showSendTasksIcon={isIntegrationValid}>
      <Grid container sx={{ mb: 1 }}>
        <DateSelector setPrevious={setPreviousDate} setNext={setNextDate} />
        <TitleDate date={date} sx={{ ml: 2, mt: 0.5, flexGrow: 1 }} />
        <ViewTypeSelector
          viewType={setting?.view_type}
          changeViewType={changeViewType}
        />
      </Grid>
      <TasksTable
        viewType={setting?.view_type}
        tasks={tasks}
        groupedTasks={groupedTasks}
      />
    </Layout>
  );
};

export default App;
