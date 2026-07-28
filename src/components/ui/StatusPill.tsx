import type { DeviceStatus } from '@/api'

const STATUS_LABEL: Record<DeviceStatus, string> = {
  awaiting: 'Awaiting',
  approved: 'Approved',
  quarantined: 'Quarantined',
  blocked: 'Blocked',
}

const STATUS_COLOR: Record<DeviceStatus, string> = {
  awaiting: 'var(--iot)',
  approved: 'var(--wired)',
  quarantined: 'var(--text-3)',
  blocked: 'var(--danger)',
}

const STATUS_BG: Record<DeviceStatus, string> = {
  awaiting: 'rgba(224,164,88,.14)',
  approved: 'rgba(45,212,167,.14)',
  quarantined: 'rgba(92,115,120,.16)',
  blocked: 'rgba(240,86,74,.14)',
}

export function StatusPill({ status }: { status: DeviceStatus }) {
  return (
    <span
      className="tagpill"
      style={{ color: STATUS_COLOR[status], background: STATUS_BG[status] }}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
