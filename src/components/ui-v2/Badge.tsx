import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { IconButton } from './IconButton'

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'violet' | 'pink' | 'amber' | 'accent'
  size?: 'md' | 'sm' | 'lg'
  dot?: boolean
  live?: boolean
  /** Renders a small remove (x) button after the label — v2's own `.badge--removable`/
   * `.badge__remove` classes are referenced in the source HTML but never defined in its
   * CSS, so this reuses the existing, already-styled IconButton instead. */
  onRemove?: () => void
  removeLabel?: string
  children: ReactNode
}

export function Badge({ variant, size = 'md', dot, live, onRemove, removeLabel, children }: BadgeProps) {
  const classes = ['badge', `badge--${variant}`, size !== 'md' ? `badge--${size}` : '', dot ? 'badge--dot' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes}>
      {dot && <span className={`badge__dot${live ? ' badge__dot--live' : ''}`} />}
      {children}
      {onRemove && (
        <IconButton variant="ghost" size="xs" aria-label={removeLabel ?? 'Remove'} onClick={onRemove}>
          <Icon name="x" />
        </IconButton>
      )}
    </span>
  )
}
