export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '60px 20px',
        color: 'var(--text-3)',
        fontSize: 13,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '2px solid var(--line-2)',
          borderTopColor: 'var(--wired)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>{message}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}