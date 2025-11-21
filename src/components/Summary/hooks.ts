import { useEffect, useState, useMemo, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { type ISummaryTask } from './types'

export function useSummary(open: boolean) {
  const [tasks, setTasks] = useState<ISummaryTask[]>([])
  const [tasksSelected, setTasksSelected] = useState<ISummaryTask[]>([])
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    invoke('summary_tasks').then((tasks) => {
      setTasks(tasks as ISummaryTask[])
    })
  }, [tasks])

  useEffect(() => {
    if (open) {
      load()
    }
  }, [open])

  function handleCheck(checked: boolean, task: ISummaryTask) {
    if (checked) {
      setTasksSelected((prev) => [...prev, task])
    } else {
      setTasksSelected((prev) => prev.filter((t) => t.id !== task.id))
    }
  }

  const duration = useMemo(() => {
    return tasksSelected.reduce((acc, cur) => acc + cur.duration, 0)
  }, [tasksSelected])

  const handleMarkAsReported = useCallback(() => {
    const ids = tasksSelected.reduce((acc: number[], cur) => {
      acc.push(...cur.ids)
      return acc
    }, [])

    setSaving(true)

    invoke('mark_tasks_as_reported', { ids }).then((success) => {
      if (success) {
        setSaving(false)
      }
      load()
      setTasksSelected([])
    })
  }, [tasksSelected, load])

  return { tasks, handleCheck, duration, tasksSelected, handleMarkAsReported, saving }
}
