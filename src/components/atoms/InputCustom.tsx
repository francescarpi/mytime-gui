import TextField from "@mui/material/TextField/TextField";
import { ChangeEventHandler } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

const InputCustom = ({
  label,
  value,
  onChange,
  size = "small",
  maxLength = 100,
  type = "text",
  error = false,
  showSearch = false,
  required = true,
  helperText = "",
  isLoading = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  size?: "small" | "medium";
  maxLength?: number;
  type?: string;
  error?: boolean;
  showSearch?: boolean;
  required?: boolean;
  helperText?: boolean | string;
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  const renderAdornment = () => {
    if (isLoading) {
      return <CircularProgress size={16} color="inherit" />;
    }

    if (showSearch) {
      return (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => {}}>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
  };

  return (
    <TextField
      label={label}
      size={size}
      error={error}
      fullWidth
      required={required}
      value={value}
      type={type}
      onChange={onChange}
      helperText={helperText}
      disabled={disabled || isLoading}
      InputProps={{
        endAdornment: renderAdornment(),
      }}
      inputProps={{
        autoComplete: "off",
        autoCorrect: "off",
        autoCapitalize: "off",
        spellCheck: "false",
        maxLength: { maxLength },
      }}
    />
  );
};

export default InputCustom;
