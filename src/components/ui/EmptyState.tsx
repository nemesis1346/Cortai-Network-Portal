import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  sub?: string
  action?: ReactNode
}

export function EmptyState({ icon = '✅', title, sub, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '60px 20px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
      {sub && <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{sub}</span>}
      {action}
    </div>
  )
}