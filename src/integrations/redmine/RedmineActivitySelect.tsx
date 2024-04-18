import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { RedmineActivity } from "./useRedmine";
import MenuItem from "@mui/material/MenuItem";

const RedmineActivitySelect = ({
  activities,
  onChange,
  value,
  size = "medium",
  disabled = false,
}: {
  activities: RedmineActivity[];
  onChange: CallableFunction;
  value: string | null;
  size?: "small" | "medium";
  disabled?: boolean;
}) => {
  return (
    <FormControl fullWidth size={size}>
      {size !== "small" && (
        <InputLabel id="redmineActivity">
          Default Activity for Redmine
        </InputLabel>
      )}
      <Select
        size={size}
        labelId="redmineActivity"
        id="redmineActivity"
        label={size === "medium" ? "Default Activity for Redmine" : undefined}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {activities.map((activity) => (
          <MenuItem value={activity.id.toString()} key={`ra-${activity.id}`}>
            {activity.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RedmineActivitySelect;
