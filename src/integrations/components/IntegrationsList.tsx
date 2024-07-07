import { Integration } from "../useIntegrations";
import IntegrationRow from "./IntegrationRow";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const IntegrationsList = ({
  integrations,
}: {
  integrations: Integration[];
}) => {
  console.log(integrations);
  return (
    <Box>
      <Grid container spacing={1}>
        <IntegrationRow />
        <IntegrationRow />
      </Grid>
    </Box>
  );
};

export default IntegrationsList;
