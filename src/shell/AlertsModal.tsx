import { useEffect, useState } from 'react'
import { homeApi, type AttentionItem } from '@/api'
import {
  Alert,
  Button,
  Icon,
  IconBadge,
  IconButton,
  Modal,
  ModalBody,
  ModalFoot,
  ModalHead,
  ModalTitle,
} from '@/components/ui-v2'

interface AlertsModalProps {
  open: boolean
  onClose: () => void
  onNavigate: (tab: string) => void
}

export function AlertsModal({ open, onClose, onNavigate }: AlertsModalProps) {
  const [items, setItems] = useState<AttentionItem[] | null>(null)

  useEffect(() => {
    if (!open) return
    homeApi.listAttention().then(setItems)
  }, [open])

  return (
    <Modal open={open} onClose={onClose} size="sm" label="Alerts">
      <ModalHead>
        <ModalTitle>Alerts</ModalTitle>
        <div className="spacer" />
        <IconButton variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
          <Icon name="x" />
        </IconButton>
      </ModalHead>
      <ModalBody>
        {items === null ? (
          <div style={{ color: 'var(--color-text-tertiary)', font: 'var(--type-body-sm)' }}>Loading…</div>
        ) : items.length === 0 ? (
          <div style={{ color: 'var(--color-text-tertiary)', font: 'var(--type-body-sm)' }}>
            Nothing to flag right now.
          </div>
        ) : (
          items.map((item) => (
            <Alert
              key={item.id}
              variant={item.severity === 'hi' ? 'danger' : 'warning'}
              icon={
                <IconBadge variant={item.severity === 'hi' ? 'red' : 'amber'} size="sm">
                  <Icon name="triangle-alert" />
                </IconBadge>
              }
              title={item.title}
              description={item.detail}
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onNavigate(item.tab)
                    onClose()
                  }}
                >
                  View
                </Button>
              }
            />
          ))
        )}
      </ModalBody>
      <ModalFoot>
        <div className="spacer" />
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </ModalFoot>
    </Modal>
  )
}
