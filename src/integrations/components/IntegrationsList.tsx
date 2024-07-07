import { useState } from "react";
import { Integration } from "../useIntegrations";
import IntegrationRow from "./IntegrationRow";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PlusOneIcon from "@mui/icons-material/PlusOne";

const IntegrationsList = ({
  integrations,
}: {
  integrations: Integration[];
}) => {
  const [tmpIntegrations, setTmpIntegrations] = useState<Integration[]>([]);
  const addIntegration = () => {
    setTmpIntegrations([
      ...tmpIntegrations,
      { id: 999999, itype: "redmine", active: false, name: null, config: "" },
    ]);
  };
  return (
    <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap sx={{}}>
      {tmpIntegrations.map((integration, index) => (
        <IntegrationRow key={index} integration={integration} />
      ))}
      <IconButton color="primary" onClick={addIntegration}>
        <PlusOneIcon />
      </IconButton>
    </Stack>
  );
};

export default IntegrationsList;
