export type DeviceStatus = 'awaiting' | 'approved' | 'quarantined' | 'blocked'

export type Vlan = 'corporate' | 'staff' | 'front-desk' | 'guest' | 'quarantine'

export type OwnerType = 'staff' | 'guest' | 'device'

export type ConnectionMedium = 'wired' | 'wifi'

export interface DeviceConnection {
  medium: ConnectionMedium
  /** Switch port, only set when medium === 'wired'. */
  port?: string
  /** SSID, only set when medium === 'wifi'. */
  ssid?: string
}

export interface Device {
  mac: string
  vendor: string
  inferred_type: string
  /** null when the device is wireless. */
  switch_port: string | null
  vlan_current: Vlan
  vlan_assigned: Vlan | null
  connection: DeviceConnection
  first_seen: string
  last_seen: string
  status: DeviceStatus
  name: string | null
  owner_type: OwnerType | null
  notes: string | null
  /** Contextual advisory text ("Ask COrtai" surface) — only present when there's something to say. */
  guardian_note?: string
  /** A friendly default for the "Device name" field — display-only, never a substitute for `name`. */
  suggested_name?: string
}

export interface ApproveRequest {
  vlan: Vlan
  name: string
  owner_type: OwnerType
}

export interface PatchRequest {
  name?: string
  owner_type?: OwnerType
  notes?: string
}

export interface DeviceActionResult {
  device: Device
  outcomeMessage: string
}

export interface ListDevicesParams {
  status?: DeviceStatus
}

export interface DeviceApi {
  list(params: ListDevicesParams): Promise<Device[]>
  approve(mac: string, body: ApproveRequest): Promise<DeviceActionResult>
  quarantine(mac: string): Promise<DeviceActionResult>
  block(mac: string): Promise<DeviceActionResult>
  patch(mac: string, body: PatchRequest): Promise<DeviceActionResult>
}

export const VLAN_LABEL: Record<Vlan, string> = {
  corporate: 'Corporate',
  staff: 'Staff',
  'front-desk': 'Front-desk',
  guest: 'Guest',
  quarantine: 'Quarantine',
}

/** The 4 assignable VLANs per the scope doc — "quarantine" is a device's held state, never a chosen target. */
export const ASSIGNABLE_VLANS: Vlan[] = ['corporate', 'staff', 'front-desk', 'guest']

export const OWNER_TYPE_LABEL: Record<OwnerType, string> = {
  staff: 'Staff',
  guest: 'Guest',
  device: 'Device',
}