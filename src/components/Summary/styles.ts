import { styled, Box } from '@mui/material'

export const Wrapper = styled(Box)`
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  border: 2px solid ${({ theme }) => theme.palette.primary.main};
  width: 80%;
  max-height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  padding: ${({ theme }) => theme.spacing(2)};
`
