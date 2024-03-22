import Layout from "./components/Layout/Layout";
import TasksTable from "./components/TasksTable/TasksTable";
import TitleDate from "./components/TitleDate";

import useSettings from "./hooks/useSettings";
import useDate from "./hooks/useDate";

const App = () => {
  const { isIntegrationValid, setting } = useSettings();
  const { humanDate } = useDate();

  return (
    <Layout showSendTasksIcon={isIntegrationValid}>
      <TitleDate humanDate={humanDate} />
      <TasksTable viewType={setting?.view_type} />
    </Layout>
  );
};

export default App;
