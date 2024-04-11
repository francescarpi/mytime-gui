import { useEffect } from "react";
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
import { Setting } from "../../hooks/useSettings";
import Integration from "./Integration";
import WorkingTime from "./WorkingTime";
import Generic from "./Generic";
import { useSnackbar } from "notistack";
import Shortcuts from "./Shortcuts";
import { RedmineActivity } from "../../hooks/useRedmine";

const Settings = ({
  opened,
  onClose,
  setting,
  saveSetting,
  setThemePreview,
  refreshTasks,
  redmineActivities,
}: {
  opened: boolean;
  onClose: CallableFunction;
  setting: Setting | null;
  saveSetting: CallableFunction;
  setThemePreview: CallableFunction;
  refreshTasks: CallableFunction;
  redmineActivities: RedmineActivity[];
}) => {
  const [activeTab, setActiveTab] = useState<string>("1");
  const [tmpSetting, setTmpSetting] = useState<Setting | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (setting) {
      setTmpSetting({ ...setting });
    }
  }, [setting, opened]);

  const saveHandler = () => {
    saveSetting(tmpSetting);
    refreshTasks();
    enqueueSnackbar("Settings saved", { variant: "success" });
    onClose();
  };

  const cancelHandler = () => {
    setThemePreview(null);
    onClose();
  };

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
                <Tab label="Shortcuts" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Generic
                setting={tmpSetting}
                setSetting={setTmpSetting}
                setThemePreview={setThemePreview}
              />
            </TabPanel>
            <TabPanel value="2">
              <Integration
                setting={tmpSetting}
                setSetting={setTmpSetting}
                redmineActivities={redmineActivities}
              />
            </TabPanel>
            <TabPanel value="3">
              <WorkingTime setting={tmpSetting} setSetting={setTmpSetting} />
            </TabPanel>
            <TabPanel value="4">
              <Shortcuts />
            </TabPanel>
          </TabContext>
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={cancelHandler} color="secondary">
            Close
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={saveHandler}>
            Save
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Settings;
