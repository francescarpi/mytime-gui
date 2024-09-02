import Integration from "../../components/Settings/Integration";
import { Setting } from "../../hooks/useSettings";
import Grid from "@mui/material/Grid2";
import RedmineActivitySelect from "./RedmineActivitySelect";
import useRedmine from "./useRedmine";
import TextField from "@mui/material/TextField";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";

const RedmineIntegrationSettings = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const { activities } = useRedmine();
  const onChangeRedmineActivity = (default_activity: string) =>
    setSetting({
      ...setting,
      integration_config: {
        ...setting?.integration_config,
        default_activity,
      },
    });

  const onChangeIntegrationToken = (e: any) =>
    setSetting({
      ...setting,
      integration_config: {
        ...setting?.integration_config,
        token: e.target.value,
      },
    });

  return (
    <Integration setting={setting} setSetting={setSetting}>
      <Grid size={6}>
        <TextField
          label="Token"
          fullWidth
          value={setting?.integration_config?.token || ""}
          onChange={onChangeIntegrationToken}
          type="password"
          inputProps={{
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
            maxLength: 255,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Go to your my account (https://<my-domain>/my/account) page to generate a token.">
                  <InfoIcon />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid size={6}>
        <RedmineActivitySelect
          activities={activities}
          value={setting?.integration_config?.default_activity || null}
          onChange={onChangeRedmineActivity}
          disabled={!activities.length}
        />
      </Grid>
    </Integration>
  );
};

export default RedmineIntegrationSettings;
