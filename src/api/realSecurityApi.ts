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
import { apiRequest, apiSocket, SITE_ID } from './realApiClient'

/**
 * Thin fetch()/WebSocket wrapper against the security endpoints proposed in
 * docs/spec-ihm-cortai-network-ops.pdf (page 8-9): GET .../security/summary and
 * GET .../east-west are named there; protection stack, attack origins, and the
 * simulation scenario aren't explicitly enumerated, so their paths are reasonable
 * extrapolations under the same namespace, same posture as realHomeApi/realControlsApi.
 * Not wired in by default — see ./index.ts. Confirm exact response envelopes with
 * Stefan before flipping VITE_API_MODE=real.
 */
export const realSecurityApi: SecurityApi = {
  getKpis() {
    return apiRequest<SecurityKpis>(`/api/v1/sites/${SITE_ID}/security/summary`)
  },

  getProtectionStack() {
    return apiRequest<ProtectionStackItem[]>(`/api/v1/sites/${SITE_ID}/security/protection-stack`)
  },

  getAttackOrigins() {
    return apiRequest<AttackOrigin[]>(`/api/v1/sites/${SITE_ID}/security/attack-origins`)
  },

  getEastWestMatrix() {
    return apiRequest<EastWestMatrix>(`/api/v1/sites/${SITE_ID}/east-west`)
  },

  listLateralEvents() {
    return apiRequest<LateralEvent[]>(`/api/v1/sites/${SITE_ID}/east-west/events`)
  },

  getSimulationScenario() {
    return apiRequest<SimulationScenario>(`/api/v1/sites/${SITE_ID}/security/simulation-scenario`)
  },

  subscribeThreatFeed(onEvent: (event: ActivityEvent) => void) {
    const ws = apiSocket(`/ws/sites/${SITE_ID}/threats`)
    ws.onmessage = (msg) => {
      onEvent(JSON.parse(msg.data) as ActivityEvent)
    }
    return () => ws.close()
  },
}
