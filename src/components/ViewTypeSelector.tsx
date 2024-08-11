import { useCallback, useContext } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { ViewType } from "../hooks/useSettings";
import { SettingsContext } from "./Settings/Provider";

const ViewTypeSelector = () => {
  const settingsContext = useContext(SettingsContext);

  const handleChange = useCallback(
    (_: any, value: ViewType) => {
      if (value) {
        settingsContext.changeViewType(value);
      }
    },
    [settingsContext],
  );

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={settingsContext.setting?.view_type}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="Chronological">
        {ViewType.Chronological}
      </ToggleButton>
      <ToggleButton value="Grouped">{ViewType.Grouped}</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewTypeSelector;
