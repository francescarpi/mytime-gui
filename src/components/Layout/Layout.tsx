import { ReactNode } from "react";
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

const Layout = ({
  children,
  showSendTasksIcon,
  summary,
  setting,
  onToggleDarkMode,
  onPressSettings,
  onPressSync,
  searchQuery,
  setSearchQuery,
}: {
  children: ReactNode;
  showSendTasksIcon: Boolean;
  summary: Summary | null;
  setting: Setting | null;
  onToggleDarkMode: CallableFunction;
  onPressSettings: CallableFunction;
  onPressSync: CallableFunction;
  searchQuery: string;
  setSearchQuery: CallableFunction;
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ top: 0, bottom: "auto" }}>
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
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
      <Box sx={{ height: "100vh", p: 2, mt: 9 }}>{children}</Box>
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
