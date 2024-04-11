import { createContext, ReactNode, useState, useEffect } from "react";
import { Setting } from "../hooks/useSettings";
import useSettings from "../hooks/useSettings";
import Settings from "../components/Settings/Settings";
import useRedmine from "../hooks/useRedmine";

const SettingsContext = createContext<{
  setting: Setting | null;
  isIntegrationValid: boolean;
  show: CallableFunction;
  changeViewType: CallableFunction;
  toggleDarkMode: CallableFunction;
}>({
  setting: null,
  isIntegrationValid: false,
  show: () => {},
  changeViewType: () => {},
  toggleDarkMode: () => {},
});

const SettingsProvider = ({
  children,
  setThemePreview,
  refreshTasks,
  setTheme,
  setDarkMode,
  setViewModeGrouped,
}: {
  children: ReactNode;
  setThemePreview: CallableFunction;
  refreshTasks: CallableFunction;
  setTheme: CallableFunction;
  setDarkMode: CallableFunction;
  setViewModeGrouped: CallableFunction;
}) => {
  const {
    setting,
    saveSettings,
    changeViewType,
    isIntegrationValid,
    toggleDarkMode,
  } = useSettings();

  const [show, setShow] = useState<boolean>(false);

  const { activities: redmineActivities } = useRedmine();

  useEffect(() => {
    if (setting) {
      setTheme(setting.theme);
      setDarkMode(setting.dark_mode);
      setViewModeGrouped(setting.view_type === "Grouped");
    }
  }, [setting, setTheme, setDarkMode, setViewModeGrouped]);

  return (
    <SettingsContext.Provider
      value={{
        setting,
        show: () => setShow(true),
        changeViewType,
        isIntegrationValid,
        toggleDarkMode,
      }}
    >
      <Settings
        opened={show}
        onClose={() => setShow(false)}
        setting={setting}
        saveSetting={saveSettings}
        setThemePreview={setThemePreview}
        refreshTasks={refreshTasks}
        redmineActivities={redmineActivities}
      />
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
