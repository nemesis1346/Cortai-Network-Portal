import { useToast } from '@/components/ui'
import { useActionLauncher } from '@/shell/ActionLauncherContext'
import type { ActionEffect } from './actionsData'

/**
 * Shared by ActionLauncher (the full 20-action search+browse modal) and
 * QuickActionModal (the small 4-row shortcut) — same 4 effect kinds, same
 * outcomes, just invoked from two different entry points. `close` is passed
 * in rather than assumed, since each modal owns its own open/close state.
 */
export function useRunActionEffect(onNavigate: (tab: string) => void, close: () => void) {
  const { requestGuardianPrefill, requestFocusBlockInput } = useActionLauncher()
  const { show: showToast } = useToast()

  return function runEffect(effect: ActionEffect) {
    switch (effect.kind) {
      case 'toast':
        close()
        showToast(effect.message)
        break
      case 'navigate':
        close()
        onNavigate(effect.tab)
        if (effect.message) showToast(effect.message)
        break
      case 'navigate-focus-block':
        close()
        onNavigate('controls')
        requestFocusBlockInput()
        break
      case 'guardian-prefill':
        close()
        onNavigate('controls')
        requestGuardianPrefill(effect.prefix)
        showToast('Fill in the details — engineer review within 1 business hour')
        break
    }
  }
}
