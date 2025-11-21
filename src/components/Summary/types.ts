export interface IProps {
  open: boolean
  onClose: () => void
}

export interface ISummaryTask {
  date: string
  desc: string
  duration: number
  id: string
  ids: number[]
  project: string
}
