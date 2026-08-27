import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  label: string
  /** Reduced inner padding for content that already carries its own padding, e.g. a single Alert. */
  bare?: boolean
  children: ReactNode
}

export function Modal({ open, onClose, size = 'md', label, bare, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  // Portalled to <body> — a modal invoked from inside a Card would otherwise
  // land as a direct child of .card, whose `.card > *:not(.card__glow) {
  // position: relative }` rule (for glow layering) outranks .modal-scrim's
  // own `position: fixed` on specificity, silently trapping the modal inside
  // the card's layout instead of covering the viewport.
  return createPortal(
    <div
      className="modal-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`modal${size !== 'md' ? ` modal--${size}` : ''}`}>
        <div
          className={`modal__inner${bare ? ' modal__inner--bare' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
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

export function ModalRule() {
  return <div className="modal__rule" />
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="modal__body v2-scrollbars">{children}</div>
}

export function ModalFoot({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div className="modal__foot" style={style}>
      {children}
    </div>
  )
}
