import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  label: string
  children: ReactNode
}

export function Modal({ open, onClose, size = 'md', label, children }: ModalProps) {
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
      className="modal-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`modal${size !== 'md' ? ` modal--${size}` : ''}`}>
        <div className="modal__inner" role="dialog" aria-modal="true" aria-label={label}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function ModalHead({ children }: { children: ReactNode }) {
  return <div className="modal__head">{children}</div>
}

export function ModalTitle({ children }: { children: ReactNode }) {
  return <div className="modal__title">{children}</div>
}

export function ModalSub({ children }: { children: ReactNode }) {
  return <div className="modal__sub">{children}</div>
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="modal__body v2-scrollbars">{children}</div>
}

export function ModalFoot({ children }: { children: ReactNode }) {
  return <div className="modal__foot">{children}</div>
}
