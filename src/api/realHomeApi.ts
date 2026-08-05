import type { ActivityEvent, Briefing, HomeApi, HomeHealth, HomeKpis, AttentionItem } from './homeTypes'

/**
 * Thin fetch()/WebSocket wrapper against the site-scoped Command Center endpoints
 * proposed in docs/spec-ihm-cortai-network-ops.pdf (page 5). Not wired in by default —
 * see ./index.ts. Confirm exact response envelopes with Stefan before flipping
 * VITE_API_MODE=real. No reconnect/backoff logic yet — out of scope while unused.
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

export const realHomeApi: HomeApi = {
  getBriefing() {
    return request<Briefing>(`/api/v1/sites/${SITE_ID}/briefing`)
  },

  getKpis(window) {
    return request<HomeKpis>(`/api/v1/sites/${SITE_ID}/kpis?window=${window}`)
  },

  getHealth() {
    return request<HomeHealth>(`/api/v1/sites/${SITE_ID}/health`)
  },

  listAttention() {
    return request<AttentionItem[]>(`/api/v1/sites/${SITE_ID}/attention`)
  },

  subscribeActivity(onEvent: (event: ActivityEvent) => void) {
    const ws = new WebSocket(`${WS_BASE_URL}/ws/sites/${SITE_ID}/activity`)
    ws.onmessage = (msg) => {
      onEvent(JSON.parse(msg.data) as ActivityEvent)
    }
    return () => ws.close()
  },
}
