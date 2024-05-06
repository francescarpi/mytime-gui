import { Setting } from "../../hooks/useSettings";
import { MuiColorInput } from "mui-color-input";
import Grid from "@mui/material/Grid";

const Generic = ({
  setting,
  setSetting,
  setThemePreview,
  setThemeSecondaryPreview,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
  setThemePreview: CallableFunction;
  setThemeSecondaryPreview: CallableFunction;
}) => {
  const onChangeTheme = (color: string) => {
    setSetting({ ...setting, theme: color });
    setThemePreview(color);
  };

  const onChangeThemeSecondary = (color: string) => {
    setSetting({ ...setting, theme_secondary: color });
    setThemeSecondaryPreview(color);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={6}>
        <MuiColorInput
          format="hex"
          value={setting?.theme || "#1976d2"}
          label="Primary"
          fullWidth
          onChange={onChangeTheme}
        />
      </Grid>
      <Grid item md={6}>
        <MuiColorInput
          format="hex"
          value={setting?.theme_secondary || "#ce93d8"}
          label="Secondary"
          fullWidth
          onChange={onChangeThemeSecondary}
        />
      </Grid>
    </Grid>
  );
};

export default Generic;
