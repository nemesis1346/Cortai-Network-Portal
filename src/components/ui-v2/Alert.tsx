import type { ReactNode } from 'react'

interface AlertProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  icon?: ReactNode
  title: string
  description?: ReactNode
  actions?: ReactNode
}

export function Alert({ variant, icon, title, description, actions }: AlertProps) {
  return (
    <div className={`alert alert--${variant}`}>
      {icon}
      <div className="alert__body">
        <div className="alert__text">
          <div className="alert__title">{title}</div>
          {description && <div className="alert__desc">{description}</div>}
        </div>
        {actions}
      </div>
    </div>
  )
}
