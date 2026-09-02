import type { CloudApp, IspIncident, LatencySeries, WanApi, WanStatus } from './wanTypes'
import { apiRequest, apiSocket, SITE_ID } from './realApiClient'

/**
 * Thin fetch()/WebSocket wrapper against a proposed /wan/ namespace — the spec doc
 * doesn't explicitly enumerate WAN Health endpoints, so these paths are a reasonable
 * extrapolation under the same convention as the other real-API files. Not wired in
 * by default — see ./index.ts. Confirm exact response envelopes with Stefan before
 * flipping VITE_API_MODE=real. No reconnect/backoff logic yet — out of scope while
 * unused, same posture as realHomeApi's activity feed.
 */
export const realWanApi: WanApi = {
  getStatus() {
    return apiRequest<WanStatus>(`/api/v1/sites/${SITE_ID}/wan/status`)
  },

  getLatencySeries() {
    return apiRequest<LatencySeries>(`/api/v1/sites/${SITE_ID}/wan/latency`)
  },

  listCloudApps() {
    return apiRequest<CloudApp[]>(`/api/v1/sites/${SITE_ID}/wan/apps`)
  },

  listIspIncidents() {
    return apiRequest<IspIncident[]>(`/api/v1/sites/${SITE_ID}/wan/incidents`)
  },

  subscribePrimaryLatency(onTick) {
    const ws = apiSocket(`/ws/sites/${SITE_ID}/wan/latency`)
    ws.onmessage = (msg) => onTick(Number(msg.data))
    return () => ws.close()
  },

  subscribeCloudAppLatency(onTick) {
    const ws = apiSocket(`/ws/sites/${SITE_ID}/wan/apps`)
    ws.onmessage = (msg) => {
      const { id, ms } = JSON.parse(msg.data) as { id: string; ms: number }
      onTick(id, ms)
    }
    return () => ws.close()
  },
}
