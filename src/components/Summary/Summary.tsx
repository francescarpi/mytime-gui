import { type IProps } from './types'
import { Modal, Typography, Stack, Button } from '@mui/material'
import { useSummary } from './hooks'
import { SummaryTable } from './components'
import * as S from './styles'
import { formatDuration } from '../../utils/dates'

export function Summary({ open, onClose }: IProps) {
  const { tasks, duration, handleCheck, tasksSelected, handleMarkAsReported, saving } = useSummary(open)

  return (
    <Modal open={open} onClose={onClose}>
      <S.Wrapper>
        <Typography variant="h5">Tasks Summary</Typography>
        <SummaryTable tasks={tasks} onCheck={handleCheck} />
        <Stack justifyContent="space-between" direction="row" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ marginTop: '16px' }}>
            Total Duration of selection: {formatDuration(duration)} ({(duration / 3600).toFixed(2)} hours)
          </Typography>
          {tasksSelected.length > 0 && (
            <Button variant="contained" size="small" onClick={handleMarkAsReported} disabled={saving}>
              Mark {tasksSelected.length} task(s) as reported
            </Button>
          )}
        </Stack>
      </S.Wrapper>
    </Modal>
  )
}
