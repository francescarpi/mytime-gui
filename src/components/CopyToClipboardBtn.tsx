import { IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { SxProps, Theme } from '@mui/material/styles'

const CopyToClipboardBtn = ({
  onClick,
  tooltip = 'Copy to clipboard',
  sx,
}: {
  onClick: CallableFunction
  tooltip?: string
  sx?: SxProps<Theme>
}) => {
  return (
    <Tooltip title={tooltip} placement="top" sx={sx}>
      <IconButton size="small" onClick={() => onClick()}>
        <ContentCopyIcon />
      </IconButton>
    </Tooltip>
  )
}

export default CopyToClipboardBtn
