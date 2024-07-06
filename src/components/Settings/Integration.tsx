import useIntegration from "../../integrations/useIntegrations";
import IntegrationsList from "../../integrations/components/IntegrationsList";
import Box from "@mui/material/Box";

const Integration = () => {
  const { integrations } = useIntegration();

  return (
    <Box>
      <IntegrationsList integrations={integrations} />
    </Box>
  );
};

export default Integration;
