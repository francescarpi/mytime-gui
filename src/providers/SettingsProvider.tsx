import { createContext, ReactNode, useState, useEffect } from "react";
import { Setting } from "../hooks/useSettings";
import useSettings from "../hooks/useSettings";
import Settings from "../components/Settings/Settings";

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
}: {
  children: ReactNode;
  setThemePreview: CallableFunction;
  refreshTasks: CallableFunction;
  setTheme: CallableFunction;
  setDarkMode: CallableFunction;
}) => {
  const {
    setting,
    saveSettings,
    changeViewType,
    isIntegrationValid,
    toggleDarkMode,
  } = useSettings();

  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (setting) {
      setTheme(setting.theme);
      setDarkMode(setting.dark_mode);
    }
  }, [setting]);

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
      />
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
