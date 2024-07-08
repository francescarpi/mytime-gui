import { useEffect, useMemo, SyntheticEvent, useState } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import WorkingTime from "./WorkingTime";
import Generic from "./Generic";
import Shortcuts from "./Shortcuts";
import Info from "./Info";
import { StyledBox } from "../../styles/modal";
import { useSnackbar } from "notistack";
import { Setting, Integration } from "../../hooks/useSettings";
import { areEquals } from "../../utils/objects";
import IntegrationsList from "../../integrations/components/IntegrationsList";

const Settings = ({
  opened,
  onClose,
  setting,
  saveSetting,
  dispatchTheme,
  refreshTasks,
  integrations,
}: {
  opened: boolean;
  onClose: CallableFunction;
  setting: Setting | null;
  saveSetting: CallableFunction;
  dispatchTheme: CallableFunction;
  refreshTasks: CallableFunction;
  integrations: Integration[];
}) => {
  const [activeTab, setActiveTab] = useState<string>("1");
  const [tmpSetting, setTmpSetting] = useState<Setting | null>(null);
  const [tmpIntegrations, setTmpIntegrations] = useState<Integration[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (setting) {
      setTmpSetting({ ...setting });
    }
  }, [setting, opened]);

  useEffect(() => {
    setTmpIntegrations(integrations);
  }, [integrations]);

  const saveHandler = () => {
    saveSetting(tmpSetting, tmpIntegrations);
    refreshTasks();
    enqueueSnackbar("Settings saved", { variant: "success" });
    onClose();
  };

  const cancelHandler = () => {
    dispatchTheme({ type: "cancelPreview" });
    onClose();
  };

  const enableSave = useMemo(() => {
    if (setting && tmpSetting && !areEquals(setting, tmpSetting)) {
      return true;
    }

    if (tmpIntegrations.length !== integrations.length) {
      return true;
    }

    let response = false;
    tmpIntegrations.forEach((integration: Integration, index: number) => {
      if (!areEquals(integration, integrations[index])) {
        response = true;
      }
    });

    return response;
  }, [tmpSetting, setting, tmpIntegrations, integrations]);

  const addIntegration = () => {
    setTmpIntegrations([
      ...tmpIntegrations,
      {
        id: null,
        itype: "Redmine",
        active: false,
        name: null,
        config: null,
      },
    ]);
  };

  const updateIntegration = (index: number, change: object) => {
    const newElement = { ...tmpIntegrations[index], ...change };
    const newList = [...tmpIntegrations];
    newList[index] = newElement;
    setTmpIntegrations(newList);
  };

  return (
    <Modal open={opened} onClose={() => onClose()}>
      <StyledBox width={1000}>
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
              <IntegrationsList
                integrations={tmpIntegrations}
                add={addIntegration}
                update={updateIntegration}
              />
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
            disabled={!enableSave}
          >
            Save
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Settings;
