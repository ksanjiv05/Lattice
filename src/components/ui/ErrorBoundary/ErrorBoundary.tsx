import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/** Catches render errors so a single broken component can't blank the whole app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('App render error:', error)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <pre className="max-w-xl overflow-auto rounded-lg bg-zinc-100 p-3 text-left text-xs text-red-600 dark:bg-zinc-900 dark:text-red-400">
          {error.message}
        </pre>
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    )
  }
}
