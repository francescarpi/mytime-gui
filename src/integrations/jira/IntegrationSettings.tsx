import Integration from "../../components/Settings/Integration";
import { Setting } from "../../hooks/useSettings";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const JiraIntegrationSettings = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const onChangeUsername = (e: any) =>
    setSetting({ ...setting, integration_username: e.target.value });

  return (
    <Integration setting={setting} setSetting={setSetting}>
      <Grid item md={12}>
        <TextField
          label="Username"
          fullWidth
          value={setting?.integration_username || ""}
          onChange={onChangeUsername}
          type="email"
          inputProps={{
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
            maxLength: 100,
          }}
        />
      </Grid>
    </Integration>
  );
};

export default JiraIntegrationSettings;
