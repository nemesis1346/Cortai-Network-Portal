import type { CloudApp, IspIncident, LatencySeries, WanApi, WanStatus } from './wanTypes'

/**
 * Thin fetch()/WebSocket wrapper against a proposed /wan/ namespace — the spec doc
 * doesn't explicitly enumerate WAN Health endpoints, so these paths are a reasonable
 * extrapolation under the same convention as the other real-API files. Not wired in
 * by default — see ./index.ts. Confirm exact response envelopes with Stefan before
 * flipping VITE_API_MODE=real.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? ''
const SITE_ID = import.meta.env.VITE_SITE_ID ?? 'default'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const realWanApi: WanApi = {
  getStatus() {
    return request<WanStatus>(`/api/v1/sites/${SITE_ID}/wan/status`)
  },

  getLatencySeries() {
    return request<LatencySeries>(`/api/v1/sites/${SITE_ID}/wan/latency`)
  },

  listCloudApps() {
    return request<CloudApp[]>(`/api/v1/sites/${SITE_ID}/wan/apps`)
  },

  listIspIncidents() {
    return request<IspIncident[]>(`/api/v1/sites/${SITE_ID}/wan/incidents`)
  },

  subscribePrimaryLatency(onTick) {
    const ws = new WebSocket(`${WS_BASE_URL}/ws/sites/${SITE_ID}/wan/latency`)
    ws.onmessage = (msg) => onTick(Number(msg.data))
    return () => ws.close()
  },

  subscribeCloudAppLatency(onTick) {
    const ws = new WebSocket(`${WS_BASE_URL}/ws/sites/${SITE_ID}/wan/apps`)
    ws.onmessage = (msg) => {
      const { id, ms } = JSON.parse(msg.data) as { id: string; ms: number }
      onTick(id, ms)
    }
    return () => ws.close()
  },
}
