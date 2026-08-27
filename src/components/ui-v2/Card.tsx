import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'raised' | 'overlay' | 'plain'
  children: ReactNode
}

export function Card({ variant, className, children, ...rest }: CardProps) {
  return (
    <div className={`card${variant ? ` card--${variant}` : ''}${className ? ` ${className}` : ''}`} {...rest}>
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
