import { createTheme } from "@mui/material/styles";

const appTheme = (
  darkMode: boolean,
  theme: string,
  themeSecondary: string,
  themePreview: string | null,
  themeSecondaryPreview: string | null,
) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: themePreview ? themePreview : theme,
      },
      secondary: {
        main: themeSecondaryPreview ? themeSecondaryPreview : themeSecondary,
      },
    },
  });

export default appTheme;
