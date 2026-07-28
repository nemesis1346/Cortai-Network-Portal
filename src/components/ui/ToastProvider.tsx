import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

interface ToastContextValue {
  show: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VISIBLE_MS = 3200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((next: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessage(next)
    // Force a reflow-safe re-trigger of the slide-in even if a toast is already showing.
    setVisible(false)
    requestAnimationFrame(() => setVisible(true))
    timerRef.current = setTimeout(() => setVisible(false), VISIBLE_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">
        {message}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}