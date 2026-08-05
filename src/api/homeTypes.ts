export type BriefingGreeting = 'morning' | 'afternoon' | 'evening'

export interface BriefingChip {
  label: string
  tab: string
}

export interface Briefing {
  greeting: BriefingGreeting
  day_label: string
  /** Prose block, ready for the typewriter effect / dangerouslySetInnerHTML. May contain inline tags (<b>, <span class="warn">). */
  narrative_html: string
  chips: BriefingChip[]
  generated_at: string
}

export interface HomeKpis {
  attacks: number
  downtime_min: number
  devices_protected: number
  self_healed: number
}

export interface HomeHealthSection {
  key: 'network' | 'security' | 'internet' | 'insights'
  label: string
  stat: string
  sub: string
  tab: string
}

export interface HomeHealth {
  score: number
  status: string
  contributors: string[]
  sections: HomeHealthSection[]
}

export type AttentionSeverity = 'hi' | 'med'

export interface AttentionItem {
  id: string
  severity: AttentionSeverity
  title: string
  detail: string
  tab: string
}

export type ActivityEventKind = 'blk' | 'qtn' | 'alw'

export interface ActivityEvent {
  id: string
  kind: ActivityEventKind
  message_html: string
  at: string
}

export interface HomeApi {
  getBriefing(): Promise<Briefing>
  getKpis(window: '1d'): Promise<HomeKpis>
  getHealth(): Promise<HomeHealth>
  listAttention(): Promise<AttentionItem[]>
  /** Subscription, not one-shot — mock uses setInterval, real uses WebSocket. Returns an unsubscribe fn. */
  subscribeActivity(onEvent: (event: ActivityEvent) => void): () => void
}

export const ACTIVITY_LABEL: Record<ActivityEventKind, string> = {
  blk: 'BLOCKED',
  qtn: 'QUARANTINED',
  alw: 'ALLOWED',
}
