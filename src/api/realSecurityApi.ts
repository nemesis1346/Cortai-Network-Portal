import type { ActivityEvent } from './homeTypes'
import type {
  AttackOrigin,
  EastWestMatrix,
  LateralEvent,
  ProtectionStackItem,
  SecurityApi,
  SecurityKpis,
  SimulationScenario,
} from './securityTypes'

/**
 * Thin fetch()/WebSocket wrapper against the security endpoints proposed in
 * docs/spec-ihm-cortai-network-ops.pdf (page 8-9): GET .../security/summary and
 * GET .../east-west are named there; protection stack, attack origins, and the
 * simulation scenario aren't explicitly enumerated, so their paths are reasonable
 * extrapolations under the same namespace, same posture as realHomeApi/realControlsApi.
 * Not wired in by default — see ./index.ts. Confirm exact response envelopes with
 * Stefan before flipping VITE_API_MODE=real.
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

export const realSecurityApi: SecurityApi = {
  getKpis() {
    return request<SecurityKpis>(`/api/v1/sites/${SITE_ID}/security/summary`)
  },

  getProtectionStack() {
    return request<ProtectionStackItem[]>(`/api/v1/sites/${SITE_ID}/security/protection-stack`)
  },

  getAttackOrigins() {
    return request<AttackOrigin[]>(`/api/v1/sites/${SITE_ID}/security/attack-origins`)
  },

  getEastWestMatrix() {
    return request<EastWestMatrix>(`/api/v1/sites/${SITE_ID}/east-west`)
  },

  listLateralEvents() {
    return request<LateralEvent[]>(`/api/v1/sites/${SITE_ID}/east-west/events`)
  },

  getSimulationScenario() {
    return request<SimulationScenario>(`/api/v1/sites/${SITE_ID}/security/simulation-scenario`)
  },

  subscribeThreatFeed(onEvent: (event: ActivityEvent) => void) {
    const ws = new WebSocket(`${WS_BASE_URL}/ws/sites/${SITE_ID}/threats`)
    ws.onmessage = (msg) => {
      onEvent(JSON.parse(msg.data) as ActivityEvent)
    }
    return () => ws.close()
  },
}
