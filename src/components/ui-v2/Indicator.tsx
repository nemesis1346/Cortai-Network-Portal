import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface IndicatorProps {
  direction: 'up' | 'down' | 'info'
  children: ReactNode
}

export function Indicator({ direction, children }: IndicatorProps) {
  return (
    <span className={`indicator indicator--${direction}`}>
      {direction !== 'info' && <Icon name={direction === 'up' ? 'arrow-up-right' : 'arrow-down-right'} />}
      {children}
    </span>
  )
}
