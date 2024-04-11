import Box from "@mui/material/Box";
import { Setting } from "../../hooks/useSettings";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { RedmineActivity } from "../../hooks/useRedmine";

const Integration = ({
  setting,
  setSetting,
  redmineActivities,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
  redmineActivities: RedmineActivity[];
}) => {
  const onChangeIntegration = (e: SelectChangeEvent) => {
    const integration = e.target.value === "Disabled" ? null : e.target.value;
    setSetting({ ...setting, integration });
  };

  const onChangeIntegrationUrl = (e: any) =>
    setSetting({ ...setting, integration_url: e.target.value });

  const onChangeIntegrationToken = (e: any) =>
    setSetting({ ...setting, integration_token: e.target.value });

  const onChangeRedmineActivity = (e: SelectChangeEvent) => {
    setSetting({
      ...setting,
      integration_extra_param: e.target.value,
    });
  };

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
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6}>
          <TextField
            label="URL"
            fullWidth
            value={setting?.integration_url}
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
        <Grid item md={12}>
          <TextField
            label="Token"
            fullWidth
            value={setting?.integration_token}
            onChange={onChangeIntegrationToken}
            inputProps={{
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: "false",
              maxLength: 100,
            }}
          />
        </Grid>
        {setting?.integration === "Redmine" && (
          <Grid item md={12}>
            <FormControl fullWidth>
              <InputLabel id="redmineActivity">
                Default Activity for Redmine
              </InputLabel>
              <Select
                labelId="redmineActivity"
                id="redmineActivity"
                label="Default Activity for Redmine"
                value={setting?.integration_extra_param || ""}
                onChange={onChangeRedmineActivity}
              >
                {redmineActivities.map((activity) => (
                  <MenuItem
                    value={activity.id.toString()}
                    key={`ra-${activity.id}`}
                  >
                    {activity.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Integration;
