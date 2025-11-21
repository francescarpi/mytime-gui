import {
  Box,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
} from '@mui/material'

import TaskIcon from './TaskIcon'
import { formatDuration } from '../../utils/dates'
import { StyledBox } from '../../styles/modal'
import { SyncProps } from './types'

const GenericSyncModal = (props: SyncProps) => {
  const {
    opened,
    onClose,
    tasks,
    integrationName,
    success,
    sendHandler,
    slotHeader,
    slotTableHeader,
    slotTableRow,
    disableSend,
    disableClose,
  } = props

  if (!opened) {
    return null
  }

  return (
    <Modal open={opened} onClose={() => onClose()}>
      <StyledBox width={1000}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Send tasks to {integrationName}
        </Typography>
        <Box>
          {slotHeader}
          {tasks.length === 0 && (
            <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
              No tasks to send. Only finished tasks with an external ID can be reported.
            </Alert>
          )}
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    External Id
                  </TableCell>
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    Task Ids
                  </TableCell>
                  {slotTableHeader}
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell align="left">
                      {task.project && '[' + task.project + ']'} {task.desc}
                    </TableCell>
                    <TableCell align="left" sx={{ textWrap: 'nowrap' }}>
                      {task.date}
                    </TableCell>
                    <TableCell align="right">{formatDuration(task.duration)}</TableCell>
                    <TableCell align="right">{task.external_id}</TableCell>
                    <TableCell align="right">{task.ids.join(', ')}</TableCell>
                    {slotTableRow && slotTableRow(task)}
                    <TableCell align="center">
                      <TaskIcon task={task} success={success} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={() => onClose()} color="secondary" disabled={disableClose}>
              Close
            </Button>
            {tasks.length > 0 && (
              <Button variant="contained" sx={{ ml: 2 }} onClick={() => sendHandler()} disabled={disableSend}>
                Send
              </Button>
            )}
          </Box>
        </Box>
      </StyledBox>
    </Modal>
  )
}

export default GenericSyncModal
