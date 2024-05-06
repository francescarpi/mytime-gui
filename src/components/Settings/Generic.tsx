import { Setting } from "../../hooks/useSettings";
import { MuiColorInput } from "mui-color-input";
import Grid from "@mui/material/Grid";

const Generic = ({
  setting,
  setSetting,
  dispatchTheme,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
  dispatchTheme: CallableFunction;
}) => {
  const onChangeTheme = (color: string) => {
    setSetting({ ...setting, theme: color });
    dispatchTheme({ type: "previewPrimary", primary: color });
  };

  const onChangeThemeSecondary = (color: string) => {
    setSetting({ ...setting, theme_secondary: color });
    dispatchTheme({ type: "previewSecondary", secondary: color });
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
