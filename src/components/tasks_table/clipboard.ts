import { useQuasar } from "quasar"
import type { Task } from "@/types/task"

export function useClipboard() {
  const $q = useQuasar()
  const copyToClipboard = (task: Task) => {
    const content = `[${task.project}] ${task.desc}`
    navigator.clipboard.writeText(content)
    $q.notify({
      message: "Copied to clipboard",
      position: "top",
    })
  }
  return {
    copyToClipboard,
  }
}
