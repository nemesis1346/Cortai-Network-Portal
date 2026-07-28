import type { DeviceApi } from './types'
import { mockDeviceApi } from './mockDeviceApi'
import { realDeviceApi } from './realDeviceApi'

/**
 * THE ONE FILE to change when Stefan's CoreTi/FortiManager backend is ready:
 * flip VITE_API_MODE to "real" (see .env.example) — no page/component changes needed.
 */
export const deviceApi: DeviceApi =
  import.meta.env.VITE_API_MODE === 'real' ? realDeviceApi : mockDeviceApi

export * from './types'