import { IconButton } from '@mui/material'
import UpgradeIcon from '@mui/icons-material/Upgrade'

const CopyStringToAddForm = ({
  dispatchDefaultAddTaskValues,
  type,
  value,
}: {
  dispatchDefaultAddTaskValues: CallableFunction
  type: string
  value: string
}) => (
  <IconButton
    size="small"
    onClick={() =>
      dispatchDefaultAddTaskValues({
        type,
        value,
      })
    }
  >
    <UpgradeIcon />
  </IconButton>
)

export default CopyStringToAddForm
