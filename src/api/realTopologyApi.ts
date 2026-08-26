import type { ClusterNode, DeviceDetail, InfraNode, TopologyApi } from './topologyTypes'

/**
 * Thin fetch() wrapper against a proposed /topology/ namespace — same
 * extrapolation convention as the other real-API files. Not wired in by
 * default — see ./index.ts. Confirm exact response envelopes with Stefan
 * before flipping VITE_API_MODE=real.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const SITE_ID = import.meta.env.VITE_SITE_ID ?? 'default'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const realTopologyApi: TopologyApi = {
  listInfraNodes() {
    return request<InfraNode[]>(`/api/v1/sites/${SITE_ID}/topology/infra`)
  },

  listClusterNodes() {
    return request<ClusterNode[]>(`/api/v1/sites/${SITE_ID}/topology/clusters`)
  },

  listDeviceDetails() {
    return request<DeviceDetail[]>(`/api/v1/sites/${SITE_ID}/topology/devices`)
  },
}
