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
  deleteIntegration,
}: {
  integrations: Integration[];
  add: CallableFunction;
  update: CallableFunction;
  deleteIntegration: CallableFunction;
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleDelete = (id: number, index: number) => {
    // calculate new tab to activate
    let newTab = index - 1;
    setActiveTab(newTab < 0 ? 0 : newTab);
    deleteIntegration(id, index);
  };
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
      {integrations.length > 0 && (
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
      )}
      {integrations.map((integration, index) => (
        <IntegrationRow
          integration={integration}
          key={`tab_content_${index}_${integration.itype}`}
          visible={activeTab === index}
          onChange={(index: number, change: object) => update(index, change)}
          index={index}
          onDelete={handleDelete}
        />
      ))}
    </Box>
  );
};

export default IntegrationsList;
