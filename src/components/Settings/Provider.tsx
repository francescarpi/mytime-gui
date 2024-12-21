import { createContext, ReactNode, useState, useEffect } from "react";

import useSettings, { Setting, ViewType } from "../../hooks/useSettings";
import Settings from "./Settings";

const SettingsContext = createContext<{
  setting: Setting | null;
  show: CallableFunction;
  changeViewType: CallableFunction;
  toggleDarkMode: CallableFunction;
  updateRightSidebarOpened: CallableFunction;
}>({
  setting: null,
  show: () => {},
  changeViewType: () => {},
  toggleDarkMode: (_value: boolean) => {},
  updateRightSidebarOpened: () => {},
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
        toggleDarkMode,
        updateRightSidebarOpened,
      }}
    >
      <Settings
        opened={show}
        onClose={() => setShow(false)}
        setting={setting}
        saveSetting={saveSettings}
        dispatchTheme={dispatchTheme}
        refreshTasks={refreshTasks}
      />
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
