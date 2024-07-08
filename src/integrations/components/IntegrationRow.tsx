import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { integrationsConfig, IntegrationField } from "../config";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Integration } from "../../hooks/useSettings";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useConfirm } from "material-ui-confirm";

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
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const config = {
      ...(integration.config || {}),
      [field]: e.target.value,
    };
    onChange(index, { config });
  };

  const onDeleteIntegration = () => {
    confirm({
      description: "Are you sure to delete this integration?",
    }).then(() => onDelete(integration.id, index));
  };

  const renderField = (field: IntegrationField, index: number) => {
    return (
      <Grid item md={field.gridWidth || 12} key={`row_${index}`}>
        <TextField
          label={field.label}
          required={true}
          fullWidth
          type={field.type}
          value={(integration.config && integration.config[field.id]) || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeConfig(field.id, e)
          }
          inputProps={{
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
            maxLength: field.maxLength,
          }}
        />
      </Grid>
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
              <Switch checked={integration.active} onChange={onChangeActive} />
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
          <TextField
            label="Name"
            fullWidth
            type="text"
            required={false}
            value={integration.name || ""}
            onChange={onChangeName}
            inputProps={{
              autoComplete: "off",
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: "false",
              maxLength: 50,
            }}
          />
        </Grid>
        <Grid item md={1}>
          <IconButton onClick={onDeleteIntegration}>
            <DeleteIcon />
          </IconButton>
        </Grid>
        {integrationsConfig
          .find((i) => i.id === integration.itype)
          ?.fields.map((field, index) => renderField(field, index))}
      </Grid>
    </Box>
  );
};

export default IntegrationRow;
