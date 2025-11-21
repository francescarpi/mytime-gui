import { useState, useEffect, useReducer } from 'react'
import { invoke } from '@tauri-apps/api/core'

export interface RedmineActivity {
  id: number
  name: string
}

const projectActivitiesReducer = (
  state: {
    [key: string]: {
      activities: RedmineActivity[]
      loading: boolean
      error: boolean
    }
  },
  action: any,
) => {
  switch (action.type) {
    case 'init':
      return {
        ...state,
        [action.id]: { activities: [], loading: true, error: false },
      }
    case 'success':
      return {
        ...state,
        [action.id]: {
          activities: action.activities,
          loading: false,
          error: false,
        },
      }
    case 'error':
      return {
        ...state,
        [action.id]: { activities: [], loading: false, error: true },
      }
  }
  return state
}

const useRedmine = () => {
  const [activities, setActivities] = useState<RedmineActivity[]>([])
  const [projectActivities, dispatchProjectActivities] = useReducer(projectActivitiesReducer, {})

  const loadRedmineActivities = () =>
    invoke('activities').then((res) => {
      const actv = (res as any).map((a: any) => ({
        id: a.id,
        name: a.name,
      })) as RedmineActivity[]
      actv.sort((a, b) => a.name.localeCompare(b.name))
      setActivities(actv)
    })

  useEffect(() => {
    loadRedmineActivities()
  }, [])

  const loadRedmineProjectActivities = async (externalId: string) => {
    dispatchProjectActivities({ type: 'init', id: externalId })
    return invoke('project_activities', { externalId })
      .then((res: any) => {
        dispatchProjectActivities({
          type: 'success',
          id: externalId,
          activities: res as RedmineActivity[],
        })
      })
      .catch(() => {
        dispatchProjectActivities({ type: 'error', id: externalId })
      })
  }

  return {
    activities,
    loadRedmineActivities,
    projectActivities,
    loadRedmineProjectActivities,
  }
}

export default useRedmine
