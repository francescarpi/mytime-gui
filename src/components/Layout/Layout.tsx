import { ReactNode, RefObject, useState, useEffect } from "react";
import { Search, SearchIconWrapper, StyledInputBase } from "./styles";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TimerIcon from "@mui/icons-material/Timer";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import { Summary } from "../../hooks/useTasks";
import Badge from "@mui/material/Badge";
import GoalProgress from "./GoalProgress";
import { DarkModeSwitch } from "../../styles/switch";
import { Setting } from "../../hooks/useSettings";
import { debounce } from "@mui/material/utils";

const Layout = ({
  children,
  showSendTasksIcon,
  summary,
  setting,
  onToggleDarkMode,
  onPressSettings,
  onPressSync,
  setSearchQuery,
  searchInputRef,
  setSearchResult,
}: {
  children: ReactNode;
  showSendTasksIcon: Boolean;
  summary: Summary | null;
  setting: Setting | null;
  onToggleDarkMode: CallableFunction;
  onPressSettings: CallableFunction;
  onPressSync: CallableFunction;
  setSearchQuery: CallableFunction;
  searchInputRef: RefObject<HTMLInputElement>;
  setSearchResult: CallableFunction;
}) => {
  const [query, setQuery] = useState("");
  const onSearchKeyPress = (e: any) => {
    if (e.code === "Escape") {
      setQuery("");
      setSearchResult([]);
      e.target.blur();
    }
  };

  useEffect(() => {
    debounce((q) => {
      setSearchQuery(q);
    }, 500)(query);
  }, [query, setSearchQuery]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ top: 0, bottom: "auto" }}
        enableColorOnDark
      >
        <Toolbar>
          <TimerIcon />
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            MyTime
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{
                ref: searchInputRef,
                autoComplete: "off",
                autoCorrect: "off",
                autoCapitalize: "off",
                spellCheck: "false",
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => onSearchKeyPress(e)}
            />
          </Search>
          {showSendTasksIcon && (
            <IconButton
              color="inherit"
              sx={{ ml: 1 }}
              onClick={() => onPressSync()}
            >
              <Badge
                color="error"
                badgeContent={
                  summary ? (summary.pending_sync_tasks as number) : 0
                }
              >
                <CloudUploadIcon />
              </Badge>
            </IconButton>
          )}
          <IconButton
            color="inherit"
            sx={{ ml: 1 }}
            onClick={() => onPressSettings()}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          p: 2,
          position: "fixed",
          top: 64,
          bottom: 48,
          left: 0,
          right: 0,
        }}
      >
        {children}
      </Box>
      <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar variant="dense" sx={{ flexGrow: 1 }}>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <GoalProgress
              goal={summary?.goal_today || 0}
              value={summary?.worked_today || 0}
            />
            <GoalProgress
              sx={{ ml: 2 }}
              goal={summary?.goal_week || 0}
              value={summary?.worked_week || 0}
            />
          </Box>
          <DarkModeSwitch
            checked={Boolean(setting?.dark_mode)}
            onChange={(e) => onToggleDarkMode(e.target.checked)}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Layout;
