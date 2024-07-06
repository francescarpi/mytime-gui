import { Integration } from "../useIntegrations";

const IntegrationsList = ({
  integrations,
}: {
  integrations: Integration[];
}) => {
  console.log(integrations);
  return <div>list</div>;
};

export default IntegrationsList;
