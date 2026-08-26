import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Field,
  Icon,
  IconBadge,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFoot,
  ModalHead,
  ModalSub,
  ModalTitle,
  Select,
} from '@/components/ui-v2'
import {
  ASSIGNABLE_VLANS,
  OWNER_TYPE_LABEL,
  VLAN_LABEL,
  type ApproveRequest,
  type Device,
  type OwnerType,
  type PatchRequest,
  type Vlan,
} from '@/api'
import { connectionLabel, deviceIcon, displayName, formatFirstSeen } from './deviceDisplay'

export type DrawerMode = 'approve' | 'edit'

interface ApproveDrawerProps {
  device: Device | null
  mode: DrawerMode
  onClose: () => void
  onApprove: (body: ApproveRequest) => Promise<void>
  onQuarantine: () => Promise<void>
  onBlock: () => Promise<void>
  onSave: (body: PatchRequest) => Promise<void>
}

const OWNER_TYPE_OPTIONS: OwnerType[] = ['staff', 'guest', 'device']

export function ApproveDrawer({
  device,
  mode,
  onClose,
  onApprove,
  onQuarantine,
  onBlock,
  onSave,
}: ApproveDrawerProps) {
  const [name, setName] = useState('')
  const [ownerType, setOwnerType] = useState<OwnerType>('staff')
  const [vlan, setVlan] = useState<Vlan>('corporate')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    if (!device) return
    setName(device.name ?? displayName(device))
    setOwnerType(device.owner_type ?? 'staff')
    setVlan(
      device.vlan_assigned && ASSIGNABLE_VLANS.includes(device.vlan_assigned)
        ? device.vlan_assigned
        : 'corporate',
    )
    setNotes(device.notes ?? '')
  }, [device])

  if (!device) return null

  const runAction = async (key: string, action: () => Promise<void>) => {
    setSubmitting(key)
    try {
      await action()
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <Modal
      open={Boolean(device)}
      onClose={onClose}
      size="sm"
      label={mode === 'approve' ? `Register: ${device.inferred_type}` : displayName(device)}
    >
      <ModalHead>
        <IconBadge variant="neutral">
          <span style={{ fontSize: 16 }}>{deviceIcon(device)}</span>
        </IconBadge>
        <div>
          <ModalTitle>{mode === 'approve' ? `Register: ${device.inferred_type}` : displayName(device)}</ModalTitle>
          <ModalSub>
            {connectionLabel(device)} · quarantined since {formatFirstSeen(device.first_seen)}
          </ModalSub>
        </div>
        <div className="spacer" />
        <IconButton variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
          <Icon name="x" />
        </IconButton>
      </ModalHead>

      <ModalBody>
        <dl className="spec">
          <div>
            <dt>MAC address</dt>
            <dd>{device.mac}</dd>
          </div>
          <div>
            <dt>Vendor</dt>
            <dd>{device.vendor}</dd>
          </div>
          <div>
            <dt>Connection</dt>
            <dd>{connectionLabel(device)}</dd>
          </div>
          <div>
            <dt>Current VLAN</dt>
            <dd>{VLAN_LABEL[device.vlan_current]}</dd>
          </div>
          {mode === 'approve' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <dt>Access while held</dt>
              <dd className="c-danger">DHCP request only — no internet</dd>
            </div>
          )}
        </dl>

        {device.guardian_note && (
          <Alert
            variant="info"
            icon={
              <IconBadge variant="violet" size="sm">
                <Icon name="zap" />
              </IconBadge>
            }
            title="Cortai suggestion"
            description={device.guardian_note}
          />
        )}

        <Field label="Device name" htmlFor="device-name">
          <Input id="device-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        {mode === 'approve' ? (
          <div className="grid-2">
            <Select
              label="Owner type"
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value as OwnerType)}
              options={OWNER_TYPE_OPTIONS.map((o) => ({ value: o, label: OWNER_TYPE_LABEL[o] }))}
            />
            <Select
              label="VLAN"
              value={vlan}
              onChange={(e) => setVlan(e.target.value as Vlan)}
              options={ASSIGNABLE_VLANS.map((v) => ({ value: v, label: VLAN_LABEL[v] }))}
            />
          </div>
        ) : (
          <>
            <Select
              label="Owner type"
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value as OwnerType)}
              options={OWNER_TYPE_OPTIONS.map((o) => ({ value: o, label: OWNER_TYPE_LABEL[o] }))}
            />
            <Field label="Notes" htmlFor="device-notes">
              <Input id="device-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
          </>
        )}
      </ModalBody>

      <ModalFoot>
        {mode === 'approve' ? (
          <>
            <Button
              variant="primary"
              size="sm"
              disabled={submitting !== null}
              onClick={() =>
                runAction('approve', () => onApprove({ vlan, name: name.trim() || displayName(device), owner_type: ownerType }))
              }
            >
              {submitting === 'approve' ? 'Approving…' : 'Approve & place on network'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={submitting !== null}
              onClick={() => runAction('quarantine', onQuarantine)}
            >
              {submitting === 'quarantine' ? 'Quarantining…' : 'Quarantine'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={submitting !== null}
              onClick={() => runAction('block', onBlock)}
            >
              {submitting === 'block' ? 'Blocking…' : 'Block permanently'}
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="sm"
            disabled={submitting !== null}
            onClick={() =>
              runAction('save', () =>
                onSave({ name: name.trim() || displayName(device), owner_type: ownerType, notes: notes.trim() || undefined }),
              )
            }
          >
            {submitting === 'save' ? 'Saving…' : 'Save'}
          </Button>
        )}
      </ModalFoot>
    </Modal>
  )
}
