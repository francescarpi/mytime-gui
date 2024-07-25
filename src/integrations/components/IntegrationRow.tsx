import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  IntegrationConfig,
  IntegrationField,
  integrationsConfig,
} from "../config";
import Switch from "@mui/material/Switch";
import { Integration } from "../../hooks/useSettings";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useConfirm } from "material-ui-confirm";
import InputCustom from "../../components/atoms/InputCustom";
import RenderFields from "./RenderFields";

const IntegrationRow = ({
  integration,
  visible,
  onChange,
  index,
  onDelete,
}: {
  integration: Integration;
  visible: boolean;
  onChange: CallableFunction;
  index: number;
  onDelete: CallableFunction;
}) => {
  const confirm = useConfirm();

  useEffect(() => {
    // Initialize config values with an empty value
    const config: any = integration.config || {};
    integrationsConfig[integration.itype].settingsFields.map((field) => {
      if (!config[field.id]) config[field.id] = field.defaultValue || "";
    });
    onChange(index, { config });
  }, []);

  const onChangeIntegrationType = (e: SelectChangeEvent) => {
    onChange(index, { itype: e.target.value });
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { name: e.target.value });
  };

  const onChangeActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { active: e.target.checked });
  };

  const onDeleteIntegration = () => {
    confirm({
      description: "Are you sure to delete the integration?",
    }).then(() => onDelete(integration.id, index));
  };

  const renderFields = () => {
    const fields = integrationsConfig[integration.itype].settingsFields;
    const apiParams = { integrationId: integration.id };
    return (
      <RenderFields
        fields={fields}
        values={integration.config}
        selectApiParams={apiParams}
        onChange={(
          field: string,
          e: React.ChangeEvent<HTMLInputElement> | string,
        ) => {
          const config = {
            ...(integration.config || {}),
            [field]: typeof e === "string" ? e : e.target.value,
          };
          onChange(index, { config });
        }}
      />
    );
  };

  return (
    <Box
      sx={{ width: "100%", paddingTop: "2rem" }}
      role="tabpanel"
      hidden={!visible}
    >
      <Grid container spacing={1}>
        <Grid item md={2} alignItems="center">
          <FormControlLabel
            sx={{ height: "100%" }}
            label="Active"
            labelPlacement="start"
            control={
              <Switch
                checked={integration.active}
                onChange={onChangeActive}
                color="success"
              />
            }
          />
        </Grid>
        <Grid item md={4}>
          <FormControl fullWidth>
            <InputLabel id="integrationType">Type</InputLabel>
            <Select
              labelId="integrationType"
              id="integrationType"
              label="Type"
              value={integration.itype}
              onChange={onChangeIntegrationType}
            >
              {Object.values(integrationsConfig).map((integrationConfig) => (
                <MenuItem
                  key={integrationConfig.id}
                  value={integrationConfig.id}
                >
                  {integrationConfig.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={5}>
          <InputCustom
            label="Name"
            required={false}
            value={integration.name || ""}
            onChange={onChangeName}
            maxLength={50}
            size="medium"
          />
        </Grid>
        <Grid item md={1}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={onDeleteIntegration}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Grid>
        {renderFields()}
      </Grid>
    </Box>
  );
};

export default IntegrationRow;
