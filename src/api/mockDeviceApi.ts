import type {
  ApproveRequest,
  Device,
  DeviceActionResult,
  DeviceApi,
  ListDevicesParams,
  PatchRequest,
} from './types'
import { VLAN_LABEL } from './types'

const NETWORK_DELAY_MS = 320

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

/**
 * Seeded devices, ported from cortai-network-topology.html's PENDING array
 * (lines 2469-2484), remapped onto the scope doc's richer schema.
 */
const INITIAL_DEVICES: Device[] = [
  {
    mac: '00:26:73:B4:2F:81',
    vendor: 'Canon Inc.',
    inferred_type: 'Canon imageCLASS printer',
    switch_port: '15',
    vlan_current: 'quarantine',
    vlan_assigned: null,
    connection: { medium: 'wired', port: '15' },
    first_seen: '2026-07-23T08:52:00Z',
    last_seen: '2026-07-23T08:58:00Z',
    status: 'awaiting',
    name: null,
    owner_type: null,
    notes: null,
    guardian_note:
      'Fingerprint matches DHCP options + MAC vendor. Normal printer behavior while quarantined (DHCP + mDNS only).',
    suggested_name: 'Back-office printer',
  },
  {
    mac: '8C:79:F5:1A:90:C4',
    vendor: 'Samsung Electronics',
    inferred_type: 'Samsung Smart TV',
    switch_port: null,
    vlan_current: 'quarantine',
    vlan_assigned: null,
    connection: { medium: 'wifi', ssid: 'LIONSTON-CORP' },
    first_seen: '2026-07-23T09:07:00Z',
    last_seen: '2026-07-23T09:12:00Z',
    status: 'awaiting',
    name: null,
    owner_type: null,
    notes: null,
    guardian_note:
      'Someone used the corporate Wi-Fi password on a TV. Recommend placing it on an isolated segment — smart TVs phone home constantly and don’t belong beside your POS. Consider rotating the corp passphrase.',
    suggested_name: 'Breakroom TV',
  },
  {
    mac: 'E4:54:E8:7C:33:5A',
    vendor: 'Dell Inc.',
    inferred_type: 'Dell Latitude laptop (Windows 11)',
    switch_port: null,
    vlan_current: 'quarantine',
    vlan_assigned: null,
    connection: { medium: 'wifi', ssid: 'LIONSTON-CORP' },
    first_seen: '2026-07-23T09:21:00Z',
    last_seen: '2026-07-23T09:30:00Z',
    status: 'awaiting',
    name: null,
    owner_type: null,
    notes: null,
    guardian_note:
      'Fingerprint says corporate-class laptop: Dell hardware, Windows 11, domain-join attempt observed. Looks like a new hire’s machine. If so, approve it and put the person’s name in the owner field. If you’re NOT expecting a new laptop today, keep it quarantined and ask your team — corporate credentials on an unexpected device is worth a question.',
    suggested_name: 'LT-11 — new hire laptop',
  },
]

let devices: Device[] = INITIAL_DEVICES.map((d) => ({ ...d }))

function findDevice(mac: string): Device {
  const device = devices.find((d) => d.mac === mac)
  if (!device) throw new Error(`No device registered with MAC ${mac}`)
  return device
}

function displayName(device: Device): string {
  return device.name ?? device.suggested_name ?? device.inferred_type
}

function updateDevice(mac: string, patch: Partial<Device>): Device {
  devices = devices.map((d) => (d.mac === mac ? { ...d, ...patch } : d))
  return findDevice(mac)
}

export const mockDeviceApi: DeviceApi = {
  async list({ status }: ListDevicesParams) {
    const rows = status ? devices.filter((d) => d.status === status) : devices.slice()
    return delay(rows)
  },

  async approve(mac: string, body: ApproveRequest): Promise<DeviceActionResult> {
    const device = updateDevice(mac, {
      status: 'approved',
      vlan_current: body.vlan,
      vlan_assigned: body.vlan,
      name: body.name,
      owner_type: body.owner_type,
    })
    return delay({
      device,
      outcomeMessage: `${body.name} — placed on ${VLAN_LABEL[body.vlan]} VLAN`,
    })
  },

  async quarantine(mac: string): Promise<DeviceActionResult> {
    const before = findDevice(mac)
    const device = updateDevice(mac, { status: 'quarantined', vlan_current: 'quarantine' })
    return delay({
      device,
      outcomeMessage: `${displayName(before)} kept in quarantine — no access until approved`,
    })
  },

  async block(mac: string): Promise<DeviceActionResult> {
    const before = findDevice(mac)
    const device = updateDevice(mac, { status: 'blocked' })
    return delay({
      device,
      outcomeMessage: `${displayName(before)} blocked — MAC banned network-wide`,
    })
  },

  async patch(mac: string, body: PatchRequest): Promise<DeviceActionResult> {
    const before = findDevice(mac)
    const device = updateDevice(mac, body)
    return delay({
      device,
      outcomeMessage: `${displayName({ ...before, ...body } as Device)} updated`,
    })
  },
}

/** Test-only: reseed mock state between test runs. */
export function resetMockDevices() {
  devices = INITIAL_DEVICES.map((d) => ({ ...d }))
}