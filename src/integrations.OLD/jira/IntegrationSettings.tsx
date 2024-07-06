import React from "react";
import Integration from "../../components/Settings/Integration.OLD";
import { Setting } from "../../hooks/useSettings";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";

const JiraIntegrationSettings = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const onChangeUsername = (e: any) =>
    setSetting({ ...setting, integration_username: e.target.value });
  const onChangeIntegrationToken = (e: any) =>
    setSetting({ ...setting, integration_token: e.target.value });

  return (
    <Integration setting={setting} setSetting={setSetting}>
      <Grid item md={6}>
        <TextField
          label="Username (email)"
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
      <Grid item md={6}>
        <TextField
          label="Token"
          fullWidth
          value={setting?.integration_token || ""}
          onChange={onChangeIntegrationToken}
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title={
                    <React.Fragment>
                      <div>
                        Go{" "}
                        <Link
                          href="https://id.atlassian.com/manage-profile/security/api-tokens"
                          target="_blank"
                        >
                          here
                        </Link>{" "}
                        to generate a token
                      </div>
                    </React.Fragment>
                  }
                >
                  <InfoIcon />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          inputProps={{
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
            maxLength: 255,
          }}
        />
      </Grid>
    </Integration>
  );
};

export default JiraIntegrationSettings;
