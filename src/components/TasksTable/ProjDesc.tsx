import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import CopyStringToAddForm from "./CopyStringToAddForm";
import CopyStringToClipboard from "./CopyStringToClipboard";
import { Task } from "../../hooks/useTasks";

const ProjDesc = ({
  task,
  dispatchDefaultAddTaskValues,
  copyStringToClipboard,
}: {
  task: Task;
  dispatchDefaultAddTaskValues: CallableFunction;
  copyStringToClipboard: CallableFunction;
}) => {
  return (
    <>
      <TableCell>
        <Box
          sx={{
            textWrap: "nowrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CopyStringToAddForm
            dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
            type="setProj"
            value={task.project}
          />
          <CopyStringToClipboard onClick={copyStringToClipboard}>
            {task.project}
          </CopyStringToClipboard>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CopyStringToAddForm
            dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
            type="setDesc"
            value={task.desc}
          />
          <CopyStringToClipboard onClick={copyStringToClipboard}>
            {task.desc}
          </CopyStringToClipboard>
        </Box>
      </TableCell>
    </>
  );
};

export default ProjDesc;
