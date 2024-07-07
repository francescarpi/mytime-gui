import { Integration } from "../useIntegrations";
import IntegrationRow from "./IntegrationRow";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const IntegrationsList = ({
  integrations,
}: {
  integrations: Integration[];
}) => {
  console.log(integrations);
  return (
    <Stack spacing={1} direction="row">
      <IntegrationRow />
      <IntegrationRow />
      <IntegrationRow />
    </Stack>
  );
};

export default IntegrationsList;
