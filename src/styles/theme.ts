import { createTheme } from "@mui/material/styles";
import { Setting } from "../hooks/useSettings";

const appTheme = (setting: Setting | null, themePreview: string | null) =>
  createTheme({
    palette: {
      mode: setting?.dark_mode ? "dark" : "light",
      primary: {
        main: themePreview ? themePreview : setting?.theme || "#1976d2",
      },
    },
  });

export default appTheme;
