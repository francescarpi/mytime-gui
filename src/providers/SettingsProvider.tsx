import { createContext, ReactNode, useState, useEffect } from "react";
import { Setting, ViewType, Integration } from "../hooks/useSettings";
import useSettings from "../hooks/useSettings";
import Settings from "../components/Settings/Settings";

const SettingsContext = createContext<{
  setting: Setting | null;
  isIntegrationValid: boolean;
  show: CallableFunction;
  changeViewType: CallableFunction;
  toggleDarkMode: CallableFunction;
  updateRightSidebarOpened: CallableFunction;
  activeIntegrations: Integration[];
}>({
  setting: null,
  isIntegrationValid: false,
  show: () => {},
  changeViewType: () => {},
  toggleDarkMode: () => {},
  updateRightSidebarOpened: () => {},
  activeIntegrations: [],
});

const SettingsProvider = ({
  children,
  refreshTasks,
  dispatchTheme,
  setDarkMode,
  setViewModeGrouped,
}: {
  children: ReactNode;
  refreshTasks: CallableFunction;
  dispatchTheme: CallableFunction;
  setDarkMode: CallableFunction;
  setViewModeGrouped: CallableFunction;
}) => {
  const {
    setting,
    saveSettings,
    changeViewType,
    toggleDarkMode,
    updateRightSidebarOpened,
    integrations,
    deleteIntegration,
    activeIntegrations,
  } = useSettings();

  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (setting) {
      dispatchTheme({
        type: "setColors",
        primary: setting.theme,
        secondary: setting.theme_secondary,
      });
      setDarkMode(setting.dark_mode);
      setViewModeGrouped(setting.view_type === ViewType.Grouped);
    }
  }, [setting, dispatchTheme, setDarkMode, setViewModeGrouped]);

  return (
    <SettingsContext.Provider
      value={{
        setting,
        show: () => setShow(true),
        changeViewType,
        isIntegrationValid: true, // TODO: check
        toggleDarkMode,
        updateRightSidebarOpened,
        activeIntegrations,
      }}
    >
      <Settings
        opened={show}
        onClose={() => setShow(false)}
        setting={setting}
        saveSetting={saveSettings}
        dispatchTheme={dispatchTheme}
        refreshTasks={refreshTasks}
        integrations={integrations}
        deleteIntegration={deleteIntegration}
      />
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
