import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { Indicator } from './Indicator'
import type { Trend } from '@/api'

interface StatCardProps {
  compact?: boolean
  glow?: 'success' | 'warning' | 'danger' | 'info' | 'accent'
  title: ReactNode
  value: ReactNode
  trend?: Trend
  label: ReactNode
  onClick?: () => void
}

export function StatCard({ compact, glow, title, value, trend, label, onClick }: StatCardProps) {
  const className = `stat-card${compact ? ' stat-card--compact' : ''}${onClick ? ' stat-card--link' : ''}`
  const content = (
    <>
      {glow && <span className={`card__glow card__glow--${glow}`} />}
      <div className="stat-card__top">
        <span className="stat-card__title">{title}</span>
        {compact && onClick && <Icon name="arrow-up-right" className="c-tertiary" />}
      </div>
      <div className="stat-card__body">
        <div className="stat-card__valuerow">
          <span className="stat-card__value num">{value}</span>
          {trend && <Indicator direction={trend.direction}>{trend.percent}%</Indicator>}
        </div>
        <span className="stat-card__label">{label}</span>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    )
  }
  return <article className={className}>{content}</article>
}
