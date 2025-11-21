import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

export interface AppInfo {
  version: string
  authors: string
  db_path: string
  total_tasks: number
}

const useInfo = () => {
  const [info, setInfo] = useState<AppInfo | null>(null)

  useEffect(() => {
    invoke('info').then((i) => {
      setInfo(i as AppInfo)
    })
  }, [])

  return { info }
}

export default useInfo
