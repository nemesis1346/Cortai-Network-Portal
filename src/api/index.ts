import type { DeviceApi } from './types'
import type { HomeApi } from './homeTypes'
import type { ControlsApi } from './controlsTypes'
import type { SecurityApi } from './securityTypes'
import type { InsightsApi } from './insightsTypes'
import type { WanApi } from './wanTypes'
import { mockDeviceApi } from './mockDeviceApi'
import { realDeviceApi } from './realDeviceApi'
import { mockHomeApi } from './mockHomeApi'
import { realHomeApi } from './realHomeApi'
import { mockControlsApi } from './mockControlsApi'
import { realControlsApi } from './realControlsApi'
import { mockSecurityApi } from './mockSecurityApi'
import { realSecurityApi } from './realSecurityApi'
import { mockInsightsApi } from './mockInsightsApi'
import { realInsightsApi } from './realInsightsApi'
import { mockWanApi } from './mockWanApi'
import { realWanApi } from './realWanApi'

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

export const securityApi: SecurityApi =
  import.meta.env.VITE_API_MODE === 'real' ? realSecurityApi : mockSecurityApi

export const insightsApi: InsightsApi =
  import.meta.env.VITE_API_MODE === 'real' ? realInsightsApi : mockInsightsApi

export const wanApi: WanApi =
  import.meta.env.VITE_API_MODE === 'real' ? realWanApi : mockWanApi

export * from './types'
export * from './homeTypes'
export * from './controlsTypes'
export * from './securityTypes'
export * from './insightsTypes'
export * from './wanTypes'