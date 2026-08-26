import type { ReactNode } from 'react'

interface IndicatorProps {
  direction: 'up' | 'down' | 'info'
  children: ReactNode
}

const SIGN: Record<IndicatorProps['direction'], string> = { up: '+', down: '-', info: '' }

/** Deliberately text-only, no directional icon — a client-requested deviation from the prototype's own arrow glyph. Direction is conveyed by the +/− sign and badge color instead. */
export function Indicator({ direction, children }: IndicatorProps) {
  return (
    <span className={`indicator indicator--${direction}`}>
      {SIGN[direction]}
      {children}
    </span>
  )
}
