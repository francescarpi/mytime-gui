import { useCallback } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import type { ViewType } from "../hooks/useSettings";

const ViewTypeSelector = ({
  viewType,
  changeViewType,
}: {
  viewType: ViewType | undefined;
  changeViewType: (viewType: ViewType) => void;
}) => {
  const handleChange = useCallback(
    (_: any, value: ViewType) => {
      changeViewType(value);
    },
    [changeViewType],
  );

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={viewType}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="Chronological">Chronological</ToggleButton>
      <ToggleButton value="Grouped">Grouped</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewTypeSelector;
