import { Task } from "../../hooks/useTasks";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";

const SyncIndicator = ({ task }: { task: Task }) =>
  task.reported ? <CloudDoneIcon /> : <CloudOffIcon />;

export default SyncIndicator;
