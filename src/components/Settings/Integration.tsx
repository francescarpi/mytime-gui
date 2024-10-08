import { ReactNode } from "react";

import { Box, InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid2";

import { Setting } from "../../hooks/useSettings";
import MyInputField from "../atoms/MyInputField";

const Integration = ({
  setting,
  setSetting,
  children,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
  children?: ReactNode;
}) => {
  const onChangeIntegration = (e: SelectChangeEvent) => {
    const integration = e.target.value === "Disabled" ? null : e.target.value;
    setSetting({ ...setting, integration });
  };

  const onChangeIntegrationUrl = (e: any) =>
    setSetting({
      ...setting,
      integration_config: {
        ...setting?.integration_config,
        url: e.target.value,
      },
    });

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel id="integrationType">Type</InputLabel>
            <Select
              labelId="integrationType"
              id="integrationType"
              label="Type"
              value={(setting?.integration as string) || "Disabled"}
              onChange={onChangeIntegration}
            >
              <MenuItem value={"Disabled"}>Disabled</MenuItem>
              <MenuItem value={"Redmine"}>Redmine</MenuItem>
              <MenuItem value={"Jira"}>Jira</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <MyInputField
            label="URL"
            value={setting?.integration_config?.url || ""}
            onChange={onChangeIntegrationUrl}
            maxLength={200}
            size="medium"
          />
        </Grid>
        {children}
      </Grid>
    </Box>
  );
};

export default Integration;
