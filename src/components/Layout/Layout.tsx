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

const Layout = ({
  children,
  showSendTasksIcon,
}: {
  children: ReactNode;
  showSendTasksIcon: boolean;
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
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
            />
          </Search>
          {showSendTasksIcon && (
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <CloudUploadIcon />
            </IconButton>
          )}
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ height: "100vh", p: 2 }}>{children}</Box>
      <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar variant="dense">Footer</Toolbar>
      </AppBar>
    </Box>
  );
};

export default Layout;
