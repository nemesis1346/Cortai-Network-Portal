import type { ReactNode } from 'react'

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'violet' | 'pink' | 'amber' | 'accent'
  size?: 'md' | 'sm' | 'lg'
  dot?: boolean
  live?: boolean
  children: ReactNode
}

export function Badge({ variant, size = 'md', dot, live, children }: BadgeProps) {
  const classes = ['badge', `badge--${variant}`, size !== 'md' ? `badge--${size}` : '', dot ? 'badge--dot' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes}>
      {dot && <span className={`badge__dot${live ? ' badge__dot--live' : ''}`} />}
      {children}
    </span>
  )
}
