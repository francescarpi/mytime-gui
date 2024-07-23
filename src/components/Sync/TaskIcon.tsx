import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const TaskIcon = ({ status, message }: { status: string; message: string }) => {
  if (status === "Pending") {
    return <CloudOffIcon />;
  }

  if (status === "Sending") {
    return <CircularProgress size={20} />;
  }

  if (status === "Success") {
    return <CloudDoneIcon color="success" />;
  }

  return (
    <Tooltip title={message}>
      <ThunderstormIcon color="error" />
    </Tooltip>
  );
};

export default TaskIcon;
