export interface HeatmapCell {
  day: string
  hour: number
  intensity: number
  tooltip: string
}

export interface TopDestination {
  domain: string
  category: string
  color: string
  abbreviation: string
  gb: number
  percent: number
  deviceCountOrPeak: string
  flag?: string
}

export interface TopTalker {
  label: string
  /** Relative magnitude (0-100ish, not a literal percent) — bar width is this value normalized against the row set's max. */
  magnitude: number
  gb: number
  note_html: string
}

export interface InsightsData {
  scopeLabel: string
  callouts: string[]
  /** 7 days x 24 hours = 168 cells. */
  heatmap: HeatmapCell[]
  topDestinations: TopDestination[]
  topTalkers: TopTalker[]
}

export interface InsightsApi {
  /** scope: 'all' or a device MAC — same "same device = same numbers" determinism as the mockup's seed scheme. */
  getInsights(scope: string): Promise<InsightsData>
}
