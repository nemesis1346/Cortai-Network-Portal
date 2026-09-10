import type { PortalApi } from './portalTypes'
import { mockAuthApi } from './mockAuthApi'
import { mockDeviceApi } from './mockDeviceApi'
import { mockHomeApi } from './mockHomeApi'
import { mockControlsApi } from './mockControlsApi'
import { mockSecurityApi } from './mockSecurityApi'
import { mockInsightsApi } from './mockInsightsApi'
import { mockWanApi } from './mockWanApi'
import { mockReportApi } from './mockReportApi'
import { mockTopologyApi } from './mockTopologyApi'

/**
 * The single mock implementation of PortalApi, selected by VITE_USE_MOCK
 * (see index.ts). Split across mock*Api.ts files internally only because the
 * seeded fixture data is large — this object is the whole mock surface.
 */
export const mockPortalApi: PortalApi = {
  auth: mockAuthApi,
  devices: mockDeviceApi,
  home: mockHomeApi,
  controls: mockControlsApi,
  security: mockSecurityApi,
  insights: mockInsightsApi,
  wan: mockWanApi,
  report: mockReportApi,
  topology: mockTopologyApi,
}
