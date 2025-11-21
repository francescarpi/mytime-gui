import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Checkbox } from '@mui/material'
import { type IProps } from './types'
import { formatDuration } from '../../../../utils/dates'

export function SummaryTable({ tasks, onCheck }: IProps) {
  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
              Task Ids
            </TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell align="left">
                <Checkbox onChange={(event) => onCheck(event.target.checked, task)} />
              </TableCell>
              <TableCell align="left">
                {task.project && '[' + task.project + ']'} {task.desc}
              </TableCell>
              <TableCell align="left" sx={{ textWrap: 'nowrap' }}>
                {task.date}
              </TableCell>
              <TableCell align="right">
                {formatDuration(task.duration)} ({(task.duration / 3600).toFixed(2)})
              </TableCell>
              <TableCell align="right">{task.ids.join(', ')}</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
