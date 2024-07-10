import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { invoke } from "@tauri-apps/api/core";

export interface SelectItem {
  label: string;
  value: string;
}

const SelectCustom = ({
  apiAction,
  apiId,
  onChange,
  value,
  size = "medium",
  disabled = false,
}: {
  apiAction: string | undefined;
  apiId: number | null;
  onChange: CallableFunction;
  value: string | null;
  size?: "small" | "medium";
  disabled?: boolean;
}) => {
  const [items, setItems] = useState<SelectItem[]>([]);

  useEffect(() => {
    if (apiAction && apiId) {
      invoke(apiAction, { id: apiId }).then((res) => {
        const elements = (res as any).map((a: any) => ({
          value: a.id,
          label: a.name,
        })) as SelectItem[];

        elements.sort((a, b) => a.label.localeCompare(b.label));
        console.log(elements);
        // setActivities(actv);
      });
    }
  }, []);

  return (
    <FormControl fullWidth size={size}>
      {size !== "small" && (
        <InputLabel id="customSelect">Default Activity</InputLabel>
      )}
      <Select
        size={size}
        labelId="customSelect"
        id="customSelect"
        label={size === "medium" ? "Default Activity for Redmine" : undefined}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {items.map((item) => (
          <MenuItem value={item.value.toString()} key={`ra-${item.value}`}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCustom;
