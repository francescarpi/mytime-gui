import { useState } from "react";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { integrationsConfig, IntegrationField } from "../config";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Integration } from "../useIntegrations";
import { capitalize } from "@mui/material";
import Typography from "@mui/material/Typography";

const IntegrationRow = ({ integration }: { integration: Integration }) => {
  const [integrationType, setIntegrationType] = useState<string>("redmine");
  const [name, setName] = useState<string>("New");

  const onChangeIntegrationType = (e: SelectChangeEvent) => {
    setIntegrationType(e.target.value);
  };

  const renderField = (field: IntegrationField, index: number) => {
    return (
      <Grid item md={field.gridWidth || 12} key={`row_${index}`}>
        <TextField
          label={field.label}
          fullWidth
          type={field.type}
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
    <Accordion sx={{ width: "49%" }}>
      <AccordionSummary>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
          {integration.name || integration.itype}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          <Grid item md={2}>
            <Switch />
          </Grid>
          <Grid item md={10}>
            <FormControl fullWidth>
              <InputLabel id="integrationType">Type</InputLabel>
              <Select
                labelId="integrationType"
                id="integrationType"
                label="Type"
                value={integrationType}
                onChange={onChangeIntegrationType}
              >
                {integrationsConfig.map((integration) => (
                  <MenuItem key={integration.id} value={integration.id}>
                    {integration.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Name"
              fullWidth
              type="text"
              inputProps={{
                autoComplete: "off",
                autoCorrect: "off",
                autoCapitalize: "off",
                spellCheck: "false",
                maxLength: 50,
              }}
            />
          </Grid>
          {integrationsConfig
            .find((integration) => integration.id === integrationType)
            ?.fields.map((field, index) => renderField(field, index))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default IntegrationRow;
