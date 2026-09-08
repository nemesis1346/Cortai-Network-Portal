import type { PortalApi } from './portalTypes'
import { realDeviceApi } from './realDeviceApi'
import { realHomeApi } from './realHomeApi'
import { realControlsApi } from './realControlsApi'
import { realSecurityApi } from './realSecurityApi'
import { realInsightsApi } from './realInsightsApi'
import { realWanApi } from './realWanApi'
import { realReportApi } from './realReportApi'
import { realTopologyApi } from './realTopologyApi'

/**
 * A reference HTTP implementation of PortalApi against extrapolated endpoint
 * shapes — NOT confirmed against a real backend. It exists so VITE_USE_MOCK=false
 * has something to resolve to and so the expected request/response shapes are
 * written down somewhere. The backend team is expected to replace this file
 * wholesale with their own implementation of PortalApi.
 */
export const realPortalApi: PortalApi = {
  devices: realDeviceApi,
  home: realHomeApi,
  controls: realControlsApi,
  security: realSecurityApi,
  insights: realInsightsApi,
  wan: realWanApi,
  report: realReportApi,
  topology: realTopologyApi,
}
