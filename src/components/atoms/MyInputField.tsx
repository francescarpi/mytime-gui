import { ChangeEventHandler } from "react";

import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const MyInputField = ({
  label,
  value,
  onChange,
  size = "small",
  maxLength = 100,
  type = "text",
  error = false,
  showSearch = false,
  searchHandler = () => {},
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
  searchHandler?: () => void;
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
          <IconButton size="small" onClick={searchHandler}>
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
      slotProps={{
        input: {
          endAdornment: renderAdornment(),
        },
        htmlInput: {
          autoComplete: "off",
          autoCorrect: "off",
          autoCapitalize: "off",
          spellCheck: "false",
          maxLength: { maxLength },
        },
      }}
    />
  );
};

export default MyInputField;
