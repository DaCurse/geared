import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadState } from './state.ts'

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch {
  // Simple save fixing mechanism
  localStorage.clear()
  loadState().then(() => location.reload())
}
