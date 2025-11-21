import { useState, useEffect, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Dayjs } from 'dayjs'

export interface Task {
  id: number
  project: string
  desc: string
  external_id: string
  start: string
  end: string | null
  reported: boolean
  shortcut: number | null
  duration: number
  has_running_tasks?: boolean
  children?: Task[]
  favourite: boolean
}

export interface Summary {
  worked_today: number
  worked_week: number
  goal_today: number
  goal_week: number
  is_running: boolean
  pending_sync_tasks: number
}

const REFRESH_INTERVAL = 30000

const useTasks = (date: Dayjs, setToday: CallableFunction) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [groupedTasks, setGroupedTasks] = useState<Task[]>([])
  const [intervalId, setIntervalId] = useState<any>(null)
  const [summary, setSummary] = useState<Summary | null>(null)

  const refresh = useCallback(() => {
    const d = date.format('YYYY-MM-DD')
    invoke('tasks', { date: d }).then((res) => setTasks(res as Task[]))
    invoke('summary', { date: d }).then((res) => setSummary(res as Summary))
  }, [date])

  useEffect(() => {
    refresh()
  }, [date, refresh])

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIntervalId(setInterval(() => refresh(), REFRESH_INTERVAL))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  useEffect(() => {
    const grouped: Task[] = tasks.reduce((acc: Task[], task: Task) => {
      const existingTask: Task | undefined = acc.find(
        (t: Task) => t.desc === task.desc && t.project === task.project && t.external_id === task.external_id,
      )
      if (existingTask) {
        existingTask.duration += task.duration
        ;(existingTask.children as Task[]).push(task)
        if (task.end === null) {
          existingTask.has_running_tasks = true
        }
        if (!task.reported) {
          existingTask.reported = false
        }
      } else {
        acc.push({
          ...task,
          has_running_tasks: task.end === null,
          children: [task],
        })
      }
      return acc
    }, [])
    setGroupedTasks(grouped)
  }, [tasks])

  const addTask = (project: string, desc: string, externalId: string) => {
    invoke('create_task', { desc, project, externalId }).then(() => setToday())
  }

  const stopTask = (id: number) => {
    invoke('stop_task', { id }).then(() => refresh())
  }

  const deleteTask = (id: number) => {
    invoke('delete_task', { id }).then(() => refresh())
  }

  const editTask = (task: Task) => invoke('edit_task', { ...task }).then(() => refresh())

  return {
    tasks,
    groupedTasks,
    addTask,
    stopTask,
    deleteTask,
    editTask,
    refresh,
    summary,
  }
}

export default useTasks
