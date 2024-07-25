import { IntegrationField } from "../config";
import Grid from "@mui/material/Grid";
import InputCustom from "../../components/atoms/InputCustom";
import SelectCustom from "../../components/atoms/SelectCustom";

type ApiParams = { [key: string]: any };

const RenderFields = ({
  fields,
  values,
  onChange,
  selectApiParams,
}: {
  fields: IntegrationField[];
  values: { [key: string]: string | null };
  onChange: CallableFunction;
  selectApiParams?: ApiParams;
}) =>
  fields.map((field: IntegrationField, index: number) => {
    if (field.componentType === "input") {
      return (
        <Grid item md={field.gridWidth || 12} key={`row_${index}`}>
          <InputCustom
            label={field.label}
            value={values[field.id] as string}
            type={field.type}
            size="medium"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(field.id, e)
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
            apiParams={selectApiParams as ApiParams}
            value={values[field.id] as string}
            onChange={(value: string) => onChange(field.id, value)}
            disabled={false}
          />
        </Grid>
      );
    }
    return "";
  });

export default RenderFields;
