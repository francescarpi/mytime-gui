import { ReactNode, RefObject, useState, useContext } from "react";
import { Search, SearchIconWrapper, StyledInputBase } from "./styles";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import { Summary } from "../../hooks/useTasks";
import Badge from "@mui/material/Badge";
import GoalProgress from "./GoalProgress";
import { DarkModeSwitch } from "../../styles/switch";
import { debounce } from "@mui/material/utils";
import { SettingsContext } from "../../providers/SettingsProvider";
import Button from "@mui/material/Button";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Logo from "../../statics/images/logo.png";
import { NewVersion } from "../../hooks/useVersion";

const Layout = ({
  children,
  summary,
  onPressSync,
  onPressFavourites,
  setSearchQuery,
  searchInputRef,
  setSearchResult,
  newVersion,
  version,
}: {
  children: ReactNode;
  summary: Summary | null;
  onPressSync: CallableFunction;
  onPressFavourites: CallableFunction;
  setSearchQuery: CallableFunction;
  searchInputRef: RefObject<HTMLInputElement>;
  setSearchResult: CallableFunction;
  newVersion: NewVersion | null;
  version: string | null;
}) => {
  const settingContext = useContext(SettingsContext);

  const [query, setQuery] = useState("");

  const resetSearch = () => {
    // The timeout is needed to prevent the search results from being cleared when clicking on a result
    setTimeout(() => {
      setQuery("");
      setSearchResult([]);
    }, 100);
  };

  const onSearchKeyPress = (e: any) => {
    if (e.code === "Escape") {
      e.target.blur();
    }
  };

  return settingContext.setting ? (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ top: 0, bottom: "auto" }}
        enableColorOnDark
      >
        <Toolbar>
          <img src={Logo} width="35" alt="Logo" />
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
                maxLength: 100,
                onInput: (e: any) => setQuery(e.target.value),
              }}
              value={query}
              onChange={debounce((e) => setSearchQuery(e.target.value), 500)}
              onKeyDown={(e) => onSearchKeyPress(e)}
              onBlur={() => resetSearch()}
            />
          </Search>
          <IconButton
            color="inherit"
            sx={{ ml: 1 }}
            onClick={() => onPressFavourites()}
          >
            <BookmarkBorderIcon />
          </IconButton>
          {settingContext.isIntegrationValid && (
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
            onClick={() => settingContext.show()}
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
          {version && (
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle2">Version: {version}</Typography>
              {newVersion && (
                <Button
                  size="small"
                  href={newVersion.url}
                  target="_blank"
                  color="warning"
                  variant="outlined"
                  sx={{ ml: 2 }}
                >
                  New version available ({newVersion.version})
                </Button>
              )}
            </Box>
          )}
          <DarkModeSwitch
            checked={Boolean(settingContext.setting?.dark_mode)}
            onChange={(e) => settingContext.toggleDarkMode(e.target.checked)}
          />
        </Toolbar>
      </AppBar>
    </Box>
  ) : (
    <Box sx={{ p: 2 }}>Loading...</Box>
  );
};

export default Layout;
