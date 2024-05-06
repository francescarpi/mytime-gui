import { createContext, ReactNode, useState, useEffect } from "react";
import { Setting, ViewType } from "../hooks/useSettings";
import useSettings from "../hooks/useSettings";
import Settings from "../components/Settings/Settings";

const SettingsContext = createContext<{
  setting: Setting | null;
  isIntegrationValid: boolean;
  show: CallableFunction;
  changeViewType: CallableFunction;
  toggleDarkMode: CallableFunction;
  updateRightSidebarOpened: CallableFunction;
}>({
  setting: null,
  isIntegrationValid: false,
  show: () => {},
  changeViewType: () => {},
  toggleDarkMode: () => {},
  updateRightSidebarOpened: () => {},
});

const SettingsProvider = ({
  children,
  refreshTasks,
  setTheme,
  setThemeSecondary,
  setThemePreview,
  setThemeSecondaryPreview,
  setDarkMode,
  setViewModeGrouped,
}: {
  children: ReactNode;
  refreshTasks: CallableFunction;
  setTheme: CallableFunction;
  setThemeSecondary: CallableFunction;
  setThemePreview: CallableFunction;
  setThemeSecondaryPreview: CallableFunction;
  setDarkMode: CallableFunction;
  setViewModeGrouped: CallableFunction;
}) => {
  const {
    setting,
    saveSettings,
    changeViewType,
    isIntegrationValid,
    toggleDarkMode,
    updateRightSidebarOpened,
  } = useSettings();

  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (setting) {
      setTheme(setting.theme);
      setThemeSecondary(setting.theme_secondary);
      setDarkMode(setting.dark_mode);
      setViewModeGrouped(setting.view_type === ViewType.Grouped);
    }
  }, [setting, setTheme, setDarkMode, setViewModeGrouped, setThemeSecondary]);

  return (
    <SettingsContext.Provider
      value={{
        setting,
        show: () => setShow(true),
        changeViewType,
        isIntegrationValid,
        toggleDarkMode,
        updateRightSidebarOpened,
      }}
    >
      <Settings
        opened={show}
        onClose={() => setShow(false)}
        setting={setting}
        saveSetting={saveSettings}
        setThemePreview={setThemePreview}
        setThemeSecondaryPreview={setThemeSecondaryPreview}
        refreshTasks={refreshTasks}
      />
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
