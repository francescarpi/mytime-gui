import Integration from "../../components/Settings/Integration.OLD";
import { Setting } from "../../hooks/useSettings";
import Grid from "@mui/material/Grid";
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
  const onChangeRedmineActivity = (value: string) => {
    setSetting({
      ...setting,
      integration_extra_param: value,
    });
  };
  const onChangeIntegrationToken = (e: any) =>
    setSetting({ ...setting, integration_token: e.target.value });

  return (
    <Integration setting={setting} setSetting={setSetting}>
      <Grid item md={6}>
        <TextField
          label="Token"
          fullWidth
          value={setting?.integration_token || ""}
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
      <Grid item md={6}>
        <RedmineActivitySelect
          activities={activities}
          value={setting?.integration_extra_param || null}
          onChange={onChangeRedmineActivity}
          disabled={!activities.length}
        />
      </Grid>
    </Integration>
  );
};

export default RedmineIntegrationSettings;
