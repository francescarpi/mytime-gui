import Layout from "./components/Layout/Layout";
import useSettings from "./hooks/useSettings";

const App = () => {
  const { isIntegrationValid } = useSettings();

  return <Layout showSendTasksIcon={isIntegrationValid}>Content</Layout>;
};

export default App;
