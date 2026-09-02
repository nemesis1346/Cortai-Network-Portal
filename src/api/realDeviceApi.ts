import type {
  ApproveRequest,
  Device,
  DeviceActionResult,
  DeviceApi,
  ListDevicesParams,
  PatchRequest,
} from './types'
import { apiRequest } from './realApiClient'

/**
 * Thin fetch() wrapper against Stefan's CoreTi backend (FortiManager integration).
 * Not wired in by default — see ./index.ts. Endpoint shapes per the Module 1 scope doc;
 * confirm exact response envelopes with Stefan before flipping VITE_API_MODE=real.
 */
export const realDeviceApi: DeviceApi = {
  list({ status }: ListDevicesParams) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return apiRequest<Device[]>(`/api/devices${query}`)
  },

  approve(mac: string, body: ApproveRequest) {
    return apiRequest<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}/approve`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  quarantine(mac: string) {
    return apiRequest<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}/quarantine`, {
      method: 'POST',
    })
  },

  block(mac: string) {
    return apiRequest<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}/block`, {
      method: 'POST',
    })
  },

  patch(mac: string, body: PatchRequest) {
    return apiRequest<DeviceActionResult>(`/api/devices/${encodeURIComponent(mac)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },
}
