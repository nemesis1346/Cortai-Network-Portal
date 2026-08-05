import type { DeviceApi } from './types'
import type { HomeApi } from './homeTypes'
import type { ControlsApi } from './controlsTypes'
import { mockDeviceApi } from './mockDeviceApi'
import { realDeviceApi } from './realDeviceApi'
import { mockHomeApi } from './mockHomeApi'
import { realHomeApi } from './realHomeApi'
import { mockControlsApi } from './mockControlsApi'
import { realControlsApi } from './realControlsApi'

/**
 * THE ONE FILE to change when Stefan's CoreTi/FortiManager backend is ready:
 * flip VITE_API_MODE to "real" (see .env.example) — no page/component changes needed.
 */
export const deviceApi: DeviceApi =
  import.meta.env.VITE_API_MODE === 'real' ? realDeviceApi : mockDeviceApi

export const homeApi: HomeApi =
  import.meta.env.VITE_API_MODE === 'real' ? realHomeApi : mockHomeApi

export const controlsApi: ControlsApi =
  import.meta.env.VITE_API_MODE === 'real' ? realControlsApi : mockControlsApi

export * from './types'
export * from './homeTypes'
export * from './controlsTypes'