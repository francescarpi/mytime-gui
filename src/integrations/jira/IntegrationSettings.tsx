import React from "react";
import Integration from "../../components/Settings/Integration";
import { Setting } from "../../hooks/useSettings";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import MyInputField from "../../components/atoms/MyInputField";

const JiraIntegrationSettings = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const onChangeUsername = (e: any) =>
    setSetting({
      ...setting,
      integration_config: {
        ...setting?.integration_config,
        email: e.target.value,
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
        <MyInputField
          label="Username (email)"
          value={setting?.integration_config?.email || ""}
          onChange={onChangeUsername}
          maxLength={100}
          type="email"
          size="medium"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          label="Token"
          fullWidth
          value={setting?.integration_config?.token || ""}
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
