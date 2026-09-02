import type { ClusterNode, DeviceDetail, InfraNode, TopologyApi } from './topologyTypes'
import { apiRequest, SITE_ID } from './realApiClient'

/**
 * Thin fetch() wrapper against a proposed /topology/ namespace — same
 * extrapolation convention as the other real-API files. Not wired in by
 * default — see ./index.ts. Confirm exact response envelopes with Stefan
 * before flipping VITE_API_MODE=real.
 */
export const realTopologyApi: TopologyApi = {
  listInfraNodes() {
    return apiRequest<InfraNode[]>(`/api/v1/sites/${SITE_ID}/topology/infra`)
  },

  listClusterNodes() {
    return apiRequest<ClusterNode[]>(`/api/v1/sites/${SITE_ID}/topology/clusters`)
  },

  listDeviceDetails() {
    return apiRequest<DeviceDetail[]>(`/api/v1/sites/${SITE_ID}/topology/devices`)
  },
}
