import { ISummaryTask } from '../../types'

export interface IProps {
  tasks: ISummaryTask[]
  onCheck: (checked: boolean, task: ISummaryTask) => void
}
