import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import updateLocale from 'dayjs/plugin/updateLocale'
import dayjs from 'dayjs'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

// Set first day of the week to Monday
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekStart: 1,
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
