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

export interface Trend {
  direction: 'up' | 'down'
  percent: number
}

export interface HomeKpis {
  attacks: number
  attacks_trend?: Trend
  downtime_min: number
  downtime_trend?: Trend
  devices_protected: number
  self_healed: number
  self_healed_trend?: Trend
}

export interface HomeHealthSection {
  key: 'network' | 'security' | 'internet' | 'insights'
  label: string
  stat: string
  /** May contain inline emphasis, e.g. <b class="c-success">...</b>. */
  sub_html: string
  tab: string
  trend?: Trend
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
  /** Relative elapsed-time display, e.g. "42 min ago" — rendered as its own trailing column. */
  elapsed: string
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
