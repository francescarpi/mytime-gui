import { createTheme } from "@mui/material/styles";
import { Theme } from "../models";

const appTheme = (darkMode: boolean, theme: Theme) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: theme.primaryPreview || theme.primary,
      },
      secondary: {
        main: theme.secondaryPreview || theme.secondary,
      },
    },
  });

export default appTheme;
