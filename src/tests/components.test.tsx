import { describe, it, afterEach, beforeEach, expect } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { mockIPC, clearMocks } from '@tauri-apps/api/mocks'
import dayjs from 'dayjs'

import App from '../App'
import { defaultSettings, defaultSummary, task1 } from './constants'

describe('components', () => {
  afterEach(cleanup)
  afterEach(clearMocks)

  beforeEach(() => {
    mockIPC((cmd: string): any => {
      switch (cmd) {
        case 'group_tasks':
          return []
        case 'tasks':
          return [task1(dayjs())]
        case 'settings':
          return defaultSettings
        case 'summary':
          return defaultSummary
        default:
          return []
      }
    })
  })

  it('app is rendered properly', async () => {
    render(<App />)
    await waitFor(() => screen.getByText('MyTime'))
    await waitFor(() => screen.getByTestId('add-task-form'))
    await waitFor(() => screen.getByTestId('tasks-filter'))
    await waitFor(() => screen.getByTestId('tasks-table'))
  })

  it('tasks table contains one task', async () => {
    render(<App />)
    await waitFor(() => screen.getByTestId('tasks-table'))
    const rows = screen.getAllByTestId('task-row')
    expect(rows.length).toBe(1)
    const td = rows[0].querySelectorAll('td')
    expect(td.length).toBe(7)
    expect(td[0].textContent).toBe('FOO')
    expect(td[1].textContent).toBe('Task 1')
    expect(td[2].textContent).toBe('12345')
    expect(td[3].textContent).toBe('0h1m')
  })
})
