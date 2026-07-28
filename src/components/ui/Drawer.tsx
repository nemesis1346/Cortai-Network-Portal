import { useEffect, type ReactNode } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  icon?: ReactNode
  title: string
  subtitle?: string
  footer?: ReactNode
  children: ReactNode
}

export function Drawer({ open, onClose, icon, title, subtitle, footer, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="ov open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="regm" role="dialog" aria-modal="true" aria-label={title}>
        <div className="regm-head">
          {icon && (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--panel-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ttl">{title}</div>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
          <button
            className="btn"
            style={{ position: 'static', marginLeft: 'auto', padding: '6px 10px' }}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="regm-body">{children}</div>
        {footer && (
          <div style={{ padding: '0 20px 20px' }}>{footer}</div>
        )}
      </div>
    </div>
  )
}