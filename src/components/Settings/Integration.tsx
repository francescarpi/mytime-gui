import Box from "@mui/material/Box";
import { Setting } from "../../hooks/useSettings";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const Integration = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const onChangeIntegration = (e: SelectChangeEvent) => {
    const integration = e.target.value === "Disabled" ? null : e.target.value;
    setSetting({ ...setting, integration });
  };

  const onChangeIntegrationUrl = (e: any) =>
    setSetting({ ...setting, integration_url: e.target.value });

  const onChangeIntegrationToken = (e: any) =>
    setSetting({ ...setting, integration_token: e.target.value });

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel id="integrationType">Type</InputLabel>
            <Select
              labelId="integrationType"
              id="integrationType"
              value={(setting?.integration as string) || "Disabled"}
              label="Age"
              onChange={onChangeIntegration}
            >
              <MenuItem value={"Disabled"}>Disabled</MenuItem>
              <MenuItem value={"Redmine"}>Redmine</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6}>
          <TextField
            label="URL"
            fullWidth
            value={setting?.integration_url}
            onChange={onChangeIntegrationUrl}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            label="Token"
            fullWidth
            value={setting?.integration_token}
            onChange={onChangeIntegrationToken}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Integration;
