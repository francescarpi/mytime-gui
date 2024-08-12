import { ReactNode } from "react";

import {
  Box,
  TextField,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Setting } from "../../hooks/useSettings";

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
    setSetting({ ...setting, integration_url: e.target.value });

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={6}>
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
        <Grid item md={6}>
          <TextField
            label="URL"
            fullWidth
            value={setting?.integration_url || ""}
            onChange={onChangeIntegrationUrl}
            inputProps={{
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: "false",
              maxLength: 200,
            }}
          />
        </Grid>
        {children}
      </Grid>
    </Box>
  );
};

export default Integration;
