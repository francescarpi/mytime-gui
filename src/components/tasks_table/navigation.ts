import { useTasksStore } from "@/stores/tasks"
import { useTaskActions } from "./task_actions"

export function useNavigation() {
  const { nextFilterDate, previousFilterDate, todayFilterDate } = useTasksStore()
  const { openTaskNumber } = useTaskActions()

  const listenKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowLeft":
        previousFilterDate()
        break
      case "ArrowRight":
        nextFilterDate()
        break
      case "ArrowDown":
        todayFilterDate()
        break
      case "Digit1":
        openTaskNumber(1)
        break
      case "Digit2":
        openTaskNumber(2)
        break
      case "Digit3":
        openTaskNumber(3)
        break
      case "Digit4":
        openTaskNumber(4)
        break
      case "Digit5":
        openTaskNumber(5)
        break
      case "Digit6":
        openTaskNumber(6)
        break
      case "Digit7":
        openTaskNumber(7)
        break
      case "Digit8":
        openTaskNumber(8)
        break
      case "Digit9":
        openTaskNumber(9)
        break
    }
  }

  return { listenKeyDown }
}
