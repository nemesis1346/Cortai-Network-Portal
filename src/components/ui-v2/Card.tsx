import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  variant?: 'flat' | 'raised' | 'overlay' | 'plain'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Card({ variant, className, style, children }: CardProps) {
  return (
    <div className={`card${variant ? ` card--${variant}` : ''}${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  wrap?: boolean
  children: ReactNode
}

export function CardHeader({ wrap, children }: CardHeaderProps) {
  return <div className={`card__header${wrap ? ' card__header--wrap' : ''}`}>{children}</div>
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <div className="card__title">{children}</div>
}

export function CardHeaderActions({ children }: { children: ReactNode }) {
  return <div className="card__header-actions">{children}</div>
}

interface CardBodyProps {
  fixed?: boolean
  className?: string
  children: ReactNode
}

export function CardBody({ fixed, className, children }: CardBodyProps) {
  return (
    <div className={`card__body v2-scrollbars${fixed ? ' card__body--fixed' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

export function CardFooter({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div className="card__footer" style={style}>
      {children}
    </div>
  )
}
