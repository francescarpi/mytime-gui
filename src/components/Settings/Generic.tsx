import { Box } from "@mui/system";
import { Setting } from "../../hooks/useSettings";
import { MuiColorInput } from "mui-color-input";

const Generic = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const onChangeTheme = (color: string) => {
    setSetting({ ...setting, theme: color });
  };
  return (
    <Box>
      <MuiColorInput
        format="hex"
        value={setting?.theme || "#1976d2"}
        label="Theme"
        fullWidth
        onChange={onChangeTheme}
      />
    </Box>
  );
};

export default Generic;
