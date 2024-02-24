import React, { PropsWithChildren } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadState } from './state.ts'

class ErrorBoundary extends React.Component<
  PropsWithChildren,
  { hasError: boolean }
> {
  constructor(props: PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch() {
    // You can also log the error to an error reporting service
    setTimeout(() => {
      localStorage.clear()
      loadState().then(() => location.reload())
    }, 1000)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h2>Sorry, your state is corrupted, resetting...</h2>
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>
)
