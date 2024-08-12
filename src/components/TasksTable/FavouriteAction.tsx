import { Tooltip, IconButton } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { Task } from "../../hooks/useTasks";

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
