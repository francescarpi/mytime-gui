import { useCallback, useContext } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import type { ViewType } from "../hooks/useSettings";
import { SettingsContext } from "../providers/SettingsProvider";

const ViewTypeSelector = () => {
  const settingsContext = useContext(SettingsContext);

  const handleChange = useCallback(
    (_: any, value: ViewType) => {
      if (value) {
        settingsContext.changeViewType(value);
      }
    },
    [settingsContext.changeViewType],
  );

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={settingsContext.setting?.view_type}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="Chronological">Chronological</ToggleButton>
      <ToggleButton value="Grouped">Grouped</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewTypeSelector;
