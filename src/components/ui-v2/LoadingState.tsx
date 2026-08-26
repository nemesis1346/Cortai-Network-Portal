interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="table__empty">
      <span className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}
