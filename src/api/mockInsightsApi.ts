import type { HeatmapCell, InsightsApi, InsightsData, TopDestination, TopTalker } from './insightsTypes'
import { rng } from './seededRandom'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

/**
 * The mockup seeds via 700 + n, where n is a laptop's numeric LT-id. We only have
 * MAC addresses, so this is a deterministic string-hash equivalent — same device
 * always yields the same seed, matching the mockup's guarantee.
 */
function hashScope(scope: string): number {
  if (scope === 'all') return 1234
  let hash = 0
  for (let i = 0; i < scope.length; i++) {
    hash = (hash * 31 + scope.charCodeAt(i)) >>> 0
  }
  return 700 + (hash % 300)
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Ported verbatim from cortai-network-topology.html:1966-1969. */
const WEEKDAY_PROFILE = [
  0.02, 0.01, 0.15, 0.1, 0.05, 0.05, 0.08, 0.3, 0.7, 1, 0.95, 0.85, 0.6, 0.85, 0.95, 0.9, 0.75, 0.5, 0.3, 0.28, 0.2,
  0.12, 0.08, 0.04,
]
const WEEKEND_PROFILE = [
  0.02, 0.01, 0.12, 0.08, 0.03, 0.03, 0.04, 0.06, 0.1, 0.14, 0.16, 0.15, 0.13, 0.12, 0.12, 0.1, 0.08, 0.07, 0.06,
  0.05, 0.04, 0.03, 0.03, 0.02,
]

function buildHeatmap(r: () => number): HeatmapCell[] {
  const cells: HeatmapCell[] = []
  for (let d = 0; d < 7; d++) {
    const profile = d < 5 ? WEEKDAY_PROFILE : WEEKEND_PROFILE
    for (let hh = 0; hh < 24; hh++) {
      const work = profile[hh]
      const v = Math.min(1, work * (0.7 + r() * 0.6))
      const intensity = 0.05 + v * 0.9
      cells.push({
        day: DAYS[d],
        hour: hh,
        intensity,
        tooltip: `${DAYS[d]} ${hh}:00 — ${(v * 3.2).toFixed(1)} GB`,
      })
    }
  }
  return cells
}

/** Ported verbatim from cortai-network-topology.html:1922-1933. */
const SITE_CATALOG = [
  { n: 'microsoft.com', c: 'Microsoft 365 · Cloud', col: '#2dd4a7', ab: 'Ms' },
  { n: 'teams.microsoft.com', c: 'Collaboration', col: '#8b7cf6', ab: 'Tm' },
  { n: 'youtube.com', c: 'Streaming', col: '#f0564a', ab: 'Yt' },
  { n: 'google.com', c: 'Web / search', col: '#5aa9e6', ab: 'Gg' },
  { n: 'marriott.com', c: 'Business · PMS/booking', col: '#e0a458', ab: 'Mr' },
  { n: 'salesforce.com', c: 'Cloud / SaaS', col: '#6fb3d8', ab: 'Sf' },
  { n: 'windowsupdate.com', c: 'System updates', col: '#8fa8f0', ab: 'Wu' },
  { n: 'spotify.com', c: 'Streaming · audio', col: '#3fe6b8', ab: 'Sp' },
  { n: 'dropbox.com', c: 'File transfer', col: '#d88cc0', ab: 'Db', flag: 'SHADOW IT' },
  { n: 'instagram.com', c: 'Social', col: '#c084fc', ab: 'Ig' },
]

function buildTopDestinations(r: () => number, scope: string): TopDestination[] {
  const weighted = SITE_CATALOG.map((s) => ({
    site: s,
    w: r() * (s.n === 'marriott.com' && scope !== 'all' ? 0.4 : 1),
  }))
  weighted.sort((a, b) => b.w - a.w)
  const picked = weighted.slice(0, 6)
  const totalGB = scope === 'all' ? 640 : 28 + r() * 40
  const weights = picked.map(() => 0.2 + r())
  const weightSum = weights.reduce((a, b) => a + b, 0)

  return picked.map((p, i) => {
    const gb = (totalGB * weights[i]) / weightSum
    const deviceCountOrPeak =
      scope === 'all' ? `${3 + Math.floor(r() * 12)} devices` : `peaks ${9 + Math.floor(r() * 3)} AM`
    return {
      domain: p.site.n,
      category: p.site.c,
      color: p.site.col,
      abbreviation: p.site.ab,
      gb: Math.round(gb * 10) / 10,
      percent: Math.round((gb / totalGB) * 100),
      deviceCountOrPeak,
      flag: p.site.flag,
    }
  })
}

/** Ported verbatim from cortai-network-topology.html:1992-1994. */
const GLOBAL_TALKERS: [string, number, string][] = [
  ['LT-03 · Sales', 94, 'baseline +12% — video calls'],
  ['CAM cluster', 88, '5 streams · constant, by design'],
  ['DT-01 · Front desk', 61, 'PMS + booking traffic'],
  ['LT-07 · Maintenance', 48, '<b style="color:var(--iot)">Dropbox 40 GB — flagged</b>'],
  ['LT-01 · Front desk', 39, 'normal office mix'],
]
const DEVICE_TALKERS: [string, number, string][] = [
  ['This device', 80, 'vs cluster median'],
  ['Cluster median', 52, ''],
  ['Quietest peer', 18, ''],
]

function buildTopTalkers(scope: string): TopTalker[] {
  const rows = scope === 'all' ? GLOBAL_TALKERS : DEVICE_TALKERS
  return rows.map(([label, magnitude, note_html]) => ({
    label,
    magnitude,
    gb: Math.round(magnitude * 1.4),
    note_html,
  }))
}

const GLOBAL_CALLOUTS = [
  'Peak hour Tue 10–11 AM · 3.1 GB/h',
  '78% business apps',
  'Streaming ×3 after 6 PM',
  'Weekend −82%',
  'Overnight backups 2–4 AM',
]

function buildDeviceCallouts(r: () => number): string[] {
  const hour = 8 + Math.floor(r() * 10)
  const pct = 40 + Math.floor(r() * 50)
  const firstSeen = `${6 + Math.floor(r() * 4)}:${r() < 0.5 ? '0' : '3'}0 AM`
  const idleAfter = `${5 + Math.floor(r() * 6)} PM`
  return [
    `Most active around ${hour}:00`,
    `${pct}% business apps`,
    `First seen daily ~${firstSeen}`,
    `Idle after ${idleAfter}`,
  ]
}

export const mockInsightsApi: InsightsApi = {
  async getInsights(scope) {
    const seed = hashScope(scope)
    const r = rng(seed)

    return delay({
      scopeLabel: scope === 'all' ? 'All devices' : scope,
      callouts: scope === 'all' ? GLOBAL_CALLOUTS : buildDeviceCallouts(r),
      heatmap: buildHeatmap(r),
      topDestinations: buildTopDestinations(r, scope),
      topTalkers: buildTopTalkers(scope),
    } satisfies InsightsData)
  },
}
