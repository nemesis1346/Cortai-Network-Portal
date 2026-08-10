import type { ActivityEvent } from './homeTypes'

export interface SecurityKpis {
  threats_blocked_30d: number
  intrusion_attempts: number
  malware_stopped: number
  phishing_blocked: number
  /** Static "A" — not animated, matches the mockup (no count-up target on this one). */
  grade: string
}

export interface ProtectionStackItem {
  label: string
  detail: string
}

export interface AttackOrigin {
  country: string
  count: number
  bar_percent: number
}

export type EastWestState = 'self' | 'ok' | 'blkd' | 'iso'

export interface EastWestCell {
  state: EastWestState
  value: string
  label: string
  tooltip: string
}

export interface EastWestMatrix {
  segments: string[]
  /** rows[i][j] = traffic from segments[i] to segments[j]. */
  rows: EastWestCell[][]
}

export type LateralSeverity = 'hi' | 'med' | 'lo'

export interface LateralEvent {
  id: string
  severity: LateralSeverity
  message_html: string
  action_html: string
}

export interface SimulationStep {
  time: string
  description: string
  tone: 'ok' | 'warn'
}

export interface SimulationScenario {
  steps: SimulationStep[]
  verdict: string
  message_html: string
  journal_title: string
  journal_rationale: string
  verify: string[]
}

export interface SecurityApi {
  getKpis(): Promise<SecurityKpis>
  getProtectionStack(): Promise<ProtectionStackItem[]>
  getAttackOrigins(): Promise<AttackOrigin[]>
  getEastWestMatrix(): Promise<EastWestMatrix>
  listLateralEvents(): Promise<LateralEvent[]>
  getSimulationScenario(): Promise<SimulationScenario>
  /** Subscription, same shape as homeApi's — mock uses the shared pool at 5s cadence, real would be a WebSocket. */
  subscribeThreatFeed(onEvent: (event: ActivityEvent) => void): () => void
}
