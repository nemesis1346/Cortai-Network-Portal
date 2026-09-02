import type { ActivityEvent, Briefing, HomeApi, HomeHealth, HomeKpis, AttentionItem } from './homeTypes'
import { apiRequest, apiSocket, SITE_ID } from './realApiClient'

/**
 * Thin fetch()/WebSocket wrapper against the site-scoped Command Center endpoints
 * proposed in docs/spec-ihm-cortai-network-ops.pdf (page 5). Not wired in by default —
 * see ./index.ts. Confirm exact response envelopes with Stefan before flipping
 * VITE_API_MODE=real. No reconnect/backoff logic yet — out of scope while unused.
 */
export const realHomeApi: HomeApi = {
  getBriefing() {
    return apiRequest<Briefing>(`/api/v1/sites/${SITE_ID}/briefing`)
  },

  getKpis(window) {
    return apiRequest<HomeKpis>(`/api/v1/sites/${SITE_ID}/kpis?window=${window}`)
  },

  getHealth() {
    return apiRequest<HomeHealth>(`/api/v1/sites/${SITE_ID}/health`)
  },

  listAttention() {
    return apiRequest<AttentionItem[]>(`/api/v1/sites/${SITE_ID}/attention`)
  },

  subscribeActivity(onEvent: (event: ActivityEvent) => void) {
    const ws = apiSocket(`/ws/sites/${SITE_ID}/activity`)
    ws.onmessage = (msg) => {
      onEvent(JSON.parse(msg.data) as ActivityEvent)
    }
    return () => ws.close()
  },
}
