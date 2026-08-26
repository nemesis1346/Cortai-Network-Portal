import type { ReactNode } from 'react'

interface IconBadgeProps {
  variant: 'green' | 'amber' | 'violet' | 'blue' | 'pink' | 'red' | 'neutral'
  size?: 'md' | 'sm' | 'lg'
  children: ReactNode
}

export function IconBadge({ variant, size = 'md', children }: IconBadgeProps) {
  const classes = ['icon-badge', `icon-badge--${variant}`, size !== 'md' ? `icon-badge--${size}` : '']
    .filter(Boolean)
    .join(' ')
  return <div className={classes}>{children}</div>
}
