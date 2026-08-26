import type { Device, DeviceStatus } from '@/api'

const STATUS_BADGE_VARIANT: Record<DeviceStatus, 'amber' | 'success' | 'neutral' | 'danger'> = {
  awaiting: 'amber',
  approved: 'success',
  quarantined: 'neutral',
  blocked: 'danger',
}

const STATUS_LABEL: Record<DeviceStatus, string> = {
  awaiting: 'Awaiting',
  approved: 'Approved',
  quarantined: 'Quarantined',
  blocked: 'Blocked',
}

export function statusBadgeVariant(status: DeviceStatus) {
  return STATUS_BADGE_VARIANT[status]
}

export function statusLabel(status: DeviceStatus): string {
  return STATUS_LABEL[status]
}

export function connectionLabel(device: Device): string {
  if (device.connection.medium === 'wired') {
    return `wired · port ${device.switch_port ?? device.connection.port ?? '—'}`
  }
  return `Wi-Fi · ${device.connection.ssid ?? 'unknown SSID'}`
}

export function deviceIcon(device: Device): string {
  const t = device.inferred_type.toLowerCase()
  if (t.includes('printer')) return '🖨'
  if (t.includes('tv')) return '📺'
  if (t.includes('laptop') || t.includes('computer')) return '💻'
  if (t.includes('phone')) return '📱'
  return '❔'
}

export function formatFirstSeen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function displayName(device: Device): string {
  return device.name ?? device.suggested_name ?? device.inferred_type
}