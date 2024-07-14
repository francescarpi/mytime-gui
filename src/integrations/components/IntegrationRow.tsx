import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { integrationsConfig, IntegrationField } from "../config";
import Switch from "@mui/material/Switch";
import { Integration } from "../../hooks/useSettings";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useConfirm } from "material-ui-confirm";
import SelectCustom from "../../components/atoms/SelectCustom";
import InputCustom from "../../components/atoms/InputCustom";

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
    const config: any = integration.config || {};
    integrationsConfig
      .find((i) => i.id === integration.itype)
      ?.fields.map((field) => {
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

  const onChangeConfig = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement> | string,
  ) => {
    const config = {
      ...(integration.config || {}),
      [field]: typeof e === "string" ? e : e.target.value,
    };
    onChange(index, { config });
  };

  const onDeleteIntegration = () => {
    confirm({
      description: "Are you sure to delete the integration?",
    }).then(() => onDelete(integration.id, index));
  };

  const renderField = (field: IntegrationField, index: number) => {
    if (field.componentType === "input") {
      return (
        <Grid item md={field.gridWidth || 12} key={`row_${index}`}>
          <InputCustom
            label={field.label}
            value={integration.config?.[field.id] || ""}
            type={field.type}
            size="medium"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangeConfig(field.id, e)
            }
            maxLength={field.maxLength}
          />
        </Grid>
      );
    }

    if (field.componentType === "select") {
      return (
        <Grid item md={field.gridWidth || 12} key={`row_${index}`}>
          <SelectCustom
            apiAction={field.apiAction as string}
            apiId={integration.id}
            value={integration.config?.[field.id] || null}
            onChange={(value: string) => onChangeConfig(field.id, value)}
            disabled={!integration.id}
          />
        </Grid>
      );
    }
    return "";
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
              {integrationsConfig.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
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
        {integrationsConfig
          .find((i) => i.id === integration.itype)
          ?.fields.map((field, index) => renderField(field, index))}
      </Grid>
    </Box>
  );
};

export default IntegrationRow;
