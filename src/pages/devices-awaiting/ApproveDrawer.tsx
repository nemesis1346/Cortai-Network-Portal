import { useEffect, useState } from 'react'
import { Drawer, Select } from '@/components/ui'
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
import './approve-drawer.css'

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
    <Drawer
      open={Boolean(device)}
      onClose={onClose}
      icon={deviceIcon(device)}
      title={mode === 'approve' ? `Register: ${device.inferred_type}` : displayName(device)}
      subtitle={`${connectionLabel(device)} · quarantined since ${formatFirstSeen(device.first_seen)}`}
    >
      <div className="kv">
        <div className="cell">
          <div className="k">MAC address</div>
          <div className="v">{device.mac}</div>
        </div>
        <div className="cell">
          <div className="k">Vendor</div>
          <div className="v">{device.vendor}</div>
        </div>
        <div className="cell">
          <div className="k">Connection</div>
          <div className="v">{connectionLabel(device)}</div>
        </div>
        <div className="cell">
          <div className="k">Current VLAN</div>
          <div className="v">{VLAN_LABEL[device.vlan_current]}</div>
        </div>
        {mode === 'approve' && (
          <div className="cell" style={{ gridColumn: '1 / -1' }}>
            <div className="k">Access while held</div>
            <div className="v bad">DHCP request only — no internet</div>
          </div>
        )}
      </div>

      {device.guardian_note && (
        <div className="gsug">
          <b>◈ COrtai:</b> {device.guardian_note}
        </div>
      )}

      <div className="fld">
        <label htmlFor="device-name">Device name</label>
        <input id="device-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {mode === 'approve' ? (
        <div className="fld2">
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
          <div className="fld">
            <label htmlFor="device-notes">Notes</label>
            <input id="device-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </>
      )}

      <div className="reg-drawer-actions">
        {mode === 'approve' ? (
          <>
            <button
              className="btn primary"
              disabled={submitting !== null}
              onClick={() =>
                runAction('approve', () => onApprove({ vlan, name: name.trim() || displayName(device), owner_type: ownerType }))
              }
            >
              {submitting === 'approve' ? 'Approving…' : 'Approve & place on network'}
            </button>
            <button
              className="btn"
              disabled={submitting !== null}
              onClick={() => runAction('quarantine', onQuarantine)}
            >
              {submitting === 'quarantine' ? 'Quarantining…' : 'Quarantine'}
            </button>
            <button
              className="btn danger"
              disabled={submitting !== null}
              onClick={() => runAction('block', onBlock)}
            >
              {submitting === 'block' ? 'Blocking…' : 'Block permanently'}
            </button>
          </>
        ) : (
          <button
            className="btn primary"
            disabled={submitting !== null}
            onClick={() =>
              runAction('save', () =>
                onSave({ name: name.trim() || displayName(device), owner_type: ownerType, notes: notes.trim() || undefined }),
              )
            }
          >
            {submitting === 'save' ? 'Saving…' : 'Save'}
          </button>
        )}
      </div>
    </Drawer>
  )
}