import { TableCell, Box } from '@mui/material'

import CopyStringToAddForm from './CopyStringToAddForm'
import CopyStringToClipboard from './CopyStringToClipboard'
import { Task } from '../../hooks/useTasks'

const ProjDescExtId = ({
  task,
  dispatchDefaultAddTaskValues,
  copyStringToClipboard,
}: {
  task: Task
  dispatchDefaultAddTaskValues: CallableFunction
  copyStringToClipboard: CallableFunction
}) => {
  return (
    <>
      <TableCell>
        <Box
          sx={{
            textWrap: 'nowrap',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CopyStringToAddForm
            dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
            type="setProj"
            value={task.project}
          />
          <CopyStringToClipboard onClick={copyStringToClipboard}>{task.project}</CopyStringToClipboard>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CopyStringToAddForm
            dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
            type="setDesc"
            value={task.desc}
          />
          <CopyStringToClipboard onClick={copyStringToClipboard}>{task.desc}</CopyStringToClipboard>
        </Box>
      </TableCell>
      <TableCell align="right">
        <Box
          sx={{
            textWrap: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {task.external_id && (
            <CopyStringToAddForm
              dispatchDefaultAddTaskValues={dispatchDefaultAddTaskValues}
              type="setExtId"
              value={task.external_id}
            />
          )}
          <CopyStringToClipboard onClick={copyStringToClipboard}>{task.external_id}</CopyStringToClipboard>
        </Box>
      </TableCell>
    </>
  )
}

export default ProjDescExtId
