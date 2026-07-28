export function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '60px 20px',
        color: 'var(--danger)',
        fontSize: 13,
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 22 }}>⚠️</span>
      <span>{message}</span>
    </div>
  )
}