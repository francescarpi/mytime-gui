import {
  useEffect,
  useMemo,
  SyntheticEvent,
  useState,
  createElement,
} from "react";

import { Modal, Typography, Box, Button, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import WorkingTime from "./WorkingTime";
import Generic from "./Generic";
import Shortcuts from "./Shortcuts";
import Info from "./Info";
import { StyledBox } from "../../styles/modal";
import { useSnackbar } from "notistack";
import { Setting } from "../../hooks/useSettings";
import { areEquals } from "../../utils/objects";
import { getIntegrationSettingsComponent } from "../../integrations";

const Settings = ({
  opened,
  onClose,
  setting,
  saveSetting,
  dispatchTheme,
  refreshTasks,
}: {
  opened: boolean;
  onClose: CallableFunction;
  setting: Setting | null;
  saveSetting: CallableFunction;
  dispatchTheme: CallableFunction;
  refreshTasks: CallableFunction;
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
    dispatchTheme({ type: "cancelPreview" });
    onClose();
  };

  const disableSave = useMemo(() => {
    return !setting || !tmpSetting || areEquals(setting, tmpSetting);
  }, [tmpSetting, setting]);

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
                <Tab label="Info" value="5" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Generic
                setting={tmpSetting}
                setSetting={setTmpSetting}
                dispatchTheme={dispatchTheme}
              />
            </TabPanel>
            <TabPanel value="2">
              {createElement(
                getIntegrationSettingsComponent(
                  tmpSetting?.integration as string,
                ),
                {
                  setting: tmpSetting,
                  setSetting: setTmpSetting,
                },
              )}
            </TabPanel>
            <TabPanel value="3">
              <WorkingTime setting={tmpSetting} setSetting={setTmpSetting} />
            </TabPanel>
            <TabPanel value="4">
              <Shortcuts />
            </TabPanel>
            <TabPanel value="5">
              <Info />
            </TabPanel>
          </TabContext>
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={cancelHandler} color="secondary">
            Close
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={saveHandler}
            disabled={disableSave}
          >
            Save
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Settings;
