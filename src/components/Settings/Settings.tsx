import { SyntheticEvent, useState } from "react";
import Modal from "@mui/material/Modal";
import { StyledBox } from "../../styles/modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const Settings = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: CallableFunction;
}) => {
  const [activeTab, setActiveTab] = useState<string>("1");

  return (
    <Modal open={opened} onClose={() => onClose()}>
      <StyledBox>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Settings
        </Typography>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(_: SyntheticEvent, newTab: string) =>
                  setActiveTab(newTab)
                }
              >
                <Tab label="Generic" value="1" />
                <Tab label="Integrations" value="2" />
                <Tab label="Working Time" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">Generic</TabPanel>
            <TabPanel value="2">Integrations</TabPanel>
            <TabPanel value="3">Work Hours</TabPanel>
          </TabContext>
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => onClose()}
            color="secondary"
          >
            Close
          </Button>
          <Button variant="contained" sx={{ ml: 2 }}>
            Save
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Settings;
