import type { LatencySeries, WanApi } from './wanTypes'
import { apiRequest, apiSocket, SITE_ID } from './realApiClient'
import { unavailable } from './unavailableError'

/**
 * Thin fetch()/WebSocket wrapper against a proposed /wan/ namespace — the spec doc
 * doesn't explicitly enumerate WAN Health endpoints, so these paths are a reasonable
 * extrapolation under the same convention as the other real-API files. Not wired in
 * by default — see ./index.ts. Confirm exact response envelopes with Stefan before
 * setting VITE_USE_MOCK=false. No reconnect/backoff logic yet — out of scope while
 * unused, same posture as realHomeApi's activity feed.
 *
 * getStatus/listCloudApps/listIspIncidents are hard-coded unavailable below —
 * this pilot site has no WAN probe, cloud-app health, or ISP-incident source
 * yet, and there's nothing to extrapolate a real call against. Wire them to a
 * real endpoint once that source exists.
 */
export const realWanApi: WanApi = {
  getStatus() {
    return unavailable('No WAN probe agent is deployed at this site yet — latency, jitter, loss and uptime require it.')
  },

  getLatencySeries() {
    return apiRequest<LatencySeries>(`/api/v1/sites/${SITE_ID}/wan/latency`)
  },

  listCloudApps() {
    return unavailable('No cloud-app health integration is configured for this site yet.')
  },

  listIspIncidents() {
    return unavailable('No ISP incident feed is configured for this site yet.')
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
