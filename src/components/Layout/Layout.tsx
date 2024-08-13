import { ReactNode, RefObject, useContext, useState, useCallback } from "react";

import {
  Toolbar,
  AppBar,
  Box,
  Typography,
  IconButton,
  Badge,
  Button,
  Slide,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import { debounce } from "@mui/material/utils";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Update } from "@tauri-apps/plugin-updater";
import { useConfirm } from "material-ui-confirm";
import { relaunch } from "@tauri-apps/plugin-process";

import { Summary } from "../../hooks/useTasks";
import GoalProgress from "./GoalProgress";
import { DarkModeSwitch } from "../../styles/switch";
import { SettingsContext } from "../Settings/Provider";
import Logo from "../../statics/images/logo.png";
import LoadingContext from "../Loading/Context";
import { Search, SearchIconWrapper, StyledInputBase } from "./styles";

const Layout = ({
  children,
  rightSideBarContent,
  summary,
  onPressSync,
  setSearchQuery,
  searchInputRef,
  newVersion,
  version,
  setToday,
}: {
  children: ReactNode;
  rightSideBarContent: ReactNode;
  summary: Summary | null;
  onPressSync: CallableFunction;
  setSearchQuery: CallableFunction;
  searchInputRef: RefObject<HTMLInputElement>;
  newVersion: Update | null;
  version: string | null;
  setToday: CallableFunction;
}) => {
  const settingContext = useContext(SettingsContext);
  const loadingContext = useContext(LoadingContext);
  const [query, setQuery] = useState<string>("");
  const confirm = useConfirm();
  const { setVisible, setText, setProgress } = loadingContext;

  const onSearchKeyPress = (e: any) => {
    if (e.code === "Escape") {
      setSearchQuery("");
      e.target.blur();
    }
  };

  const toggleRightSideBar = () => {
    settingContext.updateRightSidebarOpened(
      !settingContext.setting?.right_sidebar_open,
    );
  };

  const handleUpdate = useCallback(() => {
    confirm({
      description: "Do you want download and install the next version?",
    }).then(() => {
      // TODO: should we move this logic inside a hook?
      setText("Installing new version...");
      setVisible(true);
      let totalSize = 0;
      let downloadedSize = 0;
      let progress = 0;
      newVersion
        ?.downloadAndInstall((downloadProgress) => {
          switch (downloadProgress.event) {
            case "Started":
              totalSize = downloadProgress.data.contentLength as number;
              break;
            case "Progress":
              downloadedSize += downloadProgress.data.chunkLength;
              progress = totalSize
                ? Math.round((downloadedSize / totalSize) * 100)
                : 0;
              setProgress(`${progress}%`);
              break;
            case "Finished":
              setProgress("Relaunching...");
              break;
          }
        })
        .then(() => {
          relaunch();
        });
    });
  }, [newVersion]);

  return settingContext.setting ? (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ top: 0, bottom: "auto" }}
        enableColorOnDark
      >
        <Toolbar>
          <Button sx={{ p: 0, m: 0, minWidth: 0 }} onClick={() => setToday()}>
            <img src={Logo} width="35" alt="Logo" />
          </Button>
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
            />
          </Search>
          <IconButton
            color="inherit"
            sx={{ ml: 1 }}
            onClick={() => toggleRightSideBar()}
          >
            {settingContext.setting?.right_sidebar_open ? (
              <BookmarkIcon />
            ) : (
              <BookmarkBorderIcon />
            )}
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
          position: "fixed",
          top: 64,
          bottom: 48,
          left: 0,
          right: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          <Box sx={{ p: 2, width: "100%" }}>{children}</Box>
          <Slide
            direction="left"
            in={settingContext.setting?.right_sidebar_open}
            mountOnEnter
            unmountOnExit
          >
            <Box
              sx={{
                width: 400,
                p: 2,
                borderLeft: 1,
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.800" : "grey.300",
              }}
            >
              {rightSideBarContent}
            </Box>
          </Slide>
        </Box>
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
                  onClick={() => handleUpdate()}
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
