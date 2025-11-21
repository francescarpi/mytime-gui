import { Grid, Typography, Button } from '@mui/material'
import { Dayjs } from 'dayjs'
import SearchOffIcon from '@mui/icons-material/SearchOff'

import { Task } from '../hooks/useTasks'
import { formatDuration } from '../utils/dates'
import CopyToClipboardBtn from './CopyToClipboardBtn'
import ViewTypeSelector from './ViewTypeSelector'
import DateSelector from './DateSelector'

const TasksTableActionsHeader = ({
  searchResult,
  totalWorked,
  setPreviousDate,
  setNextDate,
  date,
  setDate,
  copyTasks,
  viewModeGrouped,
  groupedTasks,
  tasks,
  setQuery,
}: {
  searchResult: Task[]
  totalWorked: number
  setPreviousDate: CallableFunction
  setNextDate: CallableFunction
  date: Dayjs
  setDate: CallableFunction
  copyTasks: CallableFunction
  viewModeGrouped: boolean
  groupedTasks: Task[]
  tasks: Task[]
  setQuery: CallableFunction
}) => {
  return searchResult.length ? (
    <Typography sx={{ mb: 2 }} variant="h6">
      {searchResult.length} tasks found ({formatDuration(totalWorked)})
      <Button variant="contained" startIcon={<SearchOffIcon />} sx={{ ml: 2 }} onClick={() => setQuery('')}>
        Clear search reuslts
      </Button>
    </Typography>
  ) : (
    <Grid container sx={{ mb: 2 }} data-testid="tasks-filter">
      <DateSelector
        setPrevious={setPreviousDate}
        setNext={setNextDate}
        date={date}
        onChange={setDate}
        sx={{ flexGrow: 1 }}
      />
      <CopyToClipboardBtn
        onClick={() =>
          copyTasks({
            tasks: viewModeGrouped ? groupedTasks : tasks,
          })
        }
        tooltip="Copy all visible tasks to the clipboard as a list"
        sx={{ mr: 2 }}
      />
      <ViewTypeSelector />
    </Grid>
  )
}
export default TasksTableActionsHeader
