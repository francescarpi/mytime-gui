import { useState } from "react";
import { Integration } from "../../hooks/useSettings";
import IntegrationRow from "./IntegrationRow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const IntegrationsList = ({
  integrations,
  add,
  update,
}: {
  integrations: Integration[];
  add: CallableFunction;
  update: CallableFunction;
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <Box>
      <Box>
        <span>Add integrations to configure.</span>
        <Button
          onClick={() => add()}
          variant="outlined"
          sx={{ marginLeft: "1rem" }}
        >
          Add
        </Button>
      </Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {integrations.map((integration, index) => (
          <Tab
            label={integration.name || integration.itype}
            key={`tab_header_${index}_${integration.itype}`}
          />
        ))}
      </Tabs>
      {integrations.map((integration, index) => (
        <IntegrationRow
          integration={integration}
          key={`tab_content_${index}_${integration.itype}`}
          visible={activeTab === index}
          onChange={(index: number, change: object) => update(index, change)}
          index={index}
        />
      ))}
    </Box>
  );
};

export default IntegrationsList;
