import { createTheme } from "@mui/material/styles";

const appTheme = (
  darkMode: boolean,
  theme: string,
  themePreview: string | null,
) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: themePreview ? themePreview : theme,
      },
    },
  });

export default appTheme;
