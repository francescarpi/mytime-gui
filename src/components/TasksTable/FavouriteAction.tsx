import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Task } from "../../hooks/useTasks";
import { SxProps, Theme } from "@mui/material/styles";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const FavoriteAction = ({
  task,
  sx,
  toggle,
}: {
  task: Task;
  sx: SxProps<Theme>;
  toggle: CallableFunction;
}) => {
  return (
    <Tooltip title="Mark as favourite" placement="top">
      <IconButton size="small" onClick={() => toggle(task.id)} sx={sx}>
        {task.favourite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteAction;
