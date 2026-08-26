import { Button, Icon, IconBadge, IconButton, Modal, ModalBody, ModalFoot, ModalHead, ModalRule, ModalTitle } from '@/components/ui-v2'
import { useActionLauncher } from '@/shell/ActionLauncherContext'
import { ACTIONS } from './actionsData'
import { useRunActionEffect } from './useRunActionEffect'

interface QuickActionModalProps {
  open: boolean
  onClose: () => void
  onNavigate: (tab: string) => void
}

const CHANGE_WIFI = ACTIONS.find((a) => a.id === 'change-guest-wifi-password')!
const RESTART_EQUIPMENT = ACTIONS.find((a) => a.id === 'restart-equipment')!
const ONBOARD = ACTIONS.find((a) => a.id === 'onboard-employee')!

/**
 * The 4-row shortcut shown when the topbar's hamburger icon is clicked —
 * matches the v2 source's actual "Quick action" modal exactly (a small
 * curated list, not the full 20-action search grid). "Browse all actions"
 * hands off to the fuller ActionLauncher, which is this app's real build-out
 * of that row's promise ("the 20 things you'd otherwise call us for") — the
 * static prototype just links it to Controls since it has no such view.
 */
export function QuickActionModal({ open, onClose, onNavigate }: QuickActionModalProps) {
  const { open: openFullLauncher } = useActionLauncher()
  const runEffect = useRunActionEffect(onNavigate, onClose)

  const browseAll = () => {
    onClose()
    openFullLauncher()
  }

  return (
    <Modal open={open} onClose={onClose} size="xs" label="Quick action">
      <ModalHead>
        <ModalTitle>Quick action</ModalTitle>
        <div className="spacer" />
        <IconButton variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
          <Icon name="x" />
        </IconButton>
      </ModalHead>
      <ModalRule />

      <ModalBody>
        <button type="button" className="quick-action" onClick={() => runEffect(RESTART_EQUIPMENT.effect)}>
          <IconBadge variant="red" size="sm">
            <Icon name="power" />
          </IconBadge>
          <span className="feed__main">
            <span className="feed__title">Power-cycle CAM-04</span>
            <span className="feed__meta">PoE reset on switch port 11</span>
          </span>
        </button>

        <button type="button" className="quick-action" onClick={() => runEffect(CHANGE_WIFI.effect)}>
          <IconBadge variant="blue" size="sm">
            <Icon name="wifi" />
          </IconBadge>
          <span className="feed__main">
            <span className="feed__title">Change guest WiFi password</span>
            <span className="feed__meta">Most common request · 30 seconds</span>
          </span>
        </button>

        <button type="button" className="quick-action" onClick={() => runEffect(ONBOARD.effect)}>
          <IconBadge variant="violet" size="sm">
            <Icon name="users" />
          </IconBadge>
          <span className="feed__main">
            <span className="feed__title">Onboard / Off-board someone</span>
            <span className="feed__meta">Guided · devices, WiFi &amp; access in one flow</span>
          </span>
        </button>

        <button type="button" className="quick-action" onClick={browseAll}>
          <IconBadge variant="blue" size="sm">
            <Icon name="list" />
          </IconBadge>
          <span className="feed__main">
            <span className="feed__title">Browse all actions</span>
            <span className="feed__meta">The 20 things you&rsquo;d otherwise call us for</span>
          </span>
        </button>
      </ModalBody>

      <ModalFoot>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </ModalFoot>
    </Modal>
  )
}
