import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface ActionLauncherContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  /** Set by a "crFrom"-style action; GuardianForm consumes + clears it once (re)mounted on Controls. */
  guardianPrefill: string | null
  requestGuardianPrefill: (prefix: string) => void
  consumeGuardianPrefill: () => void
  /** Set by the "Block a website" action; BlockAndPauseCard consumes + clears it once (re)mounted on Controls. */
  focusBlockInputRequested: boolean
  requestFocusBlockInput: () => void
  consumeFocusBlockInput: () => void
}

const ActionLauncherContext = createContext<ActionLauncherContextValue | null>(null)

export function ActionLauncherProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [guardianPrefill, setGuardianPrefill] = useState<string | null>(null)
  const [focusBlockInputRequested, setFocusBlockInputRequested] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const requestGuardianPrefill = useCallback((prefix: string) => setGuardianPrefill(prefix), [])
  const consumeGuardianPrefill = useCallback(() => setGuardianPrefill(null), [])
  const requestFocusBlockInput = useCallback(() => setFocusBlockInputRequested(true), [])
  const consumeFocusBlockInput = useCallback(() => setFocusBlockInputRequested(false), [])

  return (
    <ActionLauncherContext.Provider
      value={{
        isOpen,
        open,
        close,
        guardianPrefill,
        requestGuardianPrefill,
        consumeGuardianPrefill,
        focusBlockInputRequested,
        requestFocusBlockInput,
        consumeFocusBlockInput,
      }}
    >
      {children}
    </ActionLauncherContext.Provider>
  )
}

export function useActionLauncher(): ActionLauncherContextValue {
  const ctx = useContext(ActionLauncherContext)
  if (!ctx) throw new Error('useActionLauncher must be used within an ActionLauncherProvider')
  return ctx
}
