import { Alert } from './Alert'
import { Button } from './Button'
import { Icon } from './Icon'
import { IconBadge } from './IconBadge'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  /** Disables both buttons and relabels confirm while the action is in flight. */
  confirming?: boolean
}

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel, confirming }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} size="xs" label={title} bare>
      <Alert
        variant="danger"
        icon={
          <IconBadge variant="red">
            <Icon name="alert-triangle" />
          </IconBadge>
        }
        title={title}
        description={description}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={onCancel} disabled={confirming}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={onConfirm} disabled={confirming}>
              {confirming ? 'Blocking…' : confirmLabel}
            </Button>
          </>
        }
      />
    </Modal>
  )
}
