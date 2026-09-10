import type { AuthApi } from './authTypes'
import type { DeviceApi } from './types'
import type { HomeApi } from './homeTypes'
import type { ControlsApi } from './controlsTypes'
import type { SecurityApi } from './securityTypes'
import type { InsightsApi } from './insightsTypes'
import type { WanApi } from './wanTypes'
import type { ReportApi } from './reportTypes'
import type { TopologyApi } from './topologyTypes'

/**
 * THE service-layer boundary for the whole portal. Everything the UI can ask of
 * a backend is reachable from this one type; nothing outside src/api/ holds data
 * or touches the network.
 *
 * Implement this one interface to wire a real backend — see mockPortalApi.ts for
 * the reference implementation and index.ts for the VITE_USE_MOCK swap.
 *
 * Grouped by domain rather than flattened into ~39 top-level methods for two
 * reasons: method names collide across domains (both home and security expose
 * getKpis), and the grouping keeps call sites reading in domain language
 * (portalApi.devices.approve(...)). Each group is a plain object of async
 * methods — the four subscribe* methods are the only non-Promise members, and
 * they return an unsubscribe function.
 */
export interface PortalApi {
  auth: AuthApi
  devices: DeviceApi
  home: HomeApi
  controls: ControlsApi
  security: SecurityApi
  insights: InsightsApi
  wan: WanApi
  report: ReportApi
  topology: TopologyApi
}
