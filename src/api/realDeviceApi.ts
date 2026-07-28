import type {
  ApproveRequest,
  Device,
  DeviceActionResult,
  DeviceApi,
  ListDevicesParams,
  PatchRequest,
} from './types'

/**
 * Thin fetch() wrapper against Stefan's CoreTi backend (FortiManager integration).
 * Not wired in by default — see ./index.ts. Endpoint shapes per the Module 1 scope doc;
 * confirm exact response envelopes with Stefan before flipping VITE_API_MODE=real.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const realDeviceApi: DeviceApi = {
  list({ status }: ListDevicesParams) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return request<Device[]>(`/api/devices${query}`)
  },

  approve(mac: string, body: ApproveRequest) {
    return request<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}/approve`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  quarantine(mac: string) {
    return request<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}/quarantine`, {
      method: 'POST',
    })
  },

  block(mac: string) {
    return request<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}/block`, {
      method: 'POST',
    })
  },

  patch(mac: string, body: PatchRequest) {
    return request<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },
}