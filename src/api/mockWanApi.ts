import type { CloudApp, IspIncident, LatencyPoint, LatencySeries, WanApi, WanStatus } from './wanTypes'
import { rng } from './seededRandom'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

const SEED_STATUS: WanStatus = {
  primary: { latencyMs: 8.2, jitterMs: 1.1, lossPercent: 0, downMbps: 942, upMbps: 861 },
  backup: { latencyMs: 34, state: 'Standby', activations90d: 2, downtimeFeltSec: 0 },
  uptime90dPercent: 99.98,
}

/** Ported verbatim from cortai-network-topology.html's drawWan() (lines 2351-2383) — seed 42, 288 points. */
function buildLatencySeries(): LatencySeries {
  const r = rng(42)
  const points: LatencyPoint[] = []
  for (let i = 0; i < 288; i++) {
    let ms: number
    if (i >= 200 && i < 214) ms = 60 + r() * 150
    else if (i >= 214 && i < 220) ms = 14 + r() * 8
    else ms = 7.5 + r() * 2.5
    points.push({ index: i, ms })
  }
  return {
    points,
    maxMs: 230,
    thresholdMs: 30,
    spikeStartIndex: 200,
    spikeEndIndex: 214,
    annotation: 'Bell spike · 14 min · auto-failover',
  }
}

const SEED_CLOUD_APPS: CloudApp[] = [
  {
    id: 'sf',
    name: 'Salesforce',
    abbreviation: 'Sf',
    color: '#5aa9e6',
    tag: 'CRM',
    meta: "salesforce.com · used by 8 devices · click for who's on it",
    verdict: 'excellent',
    verdictLabel: 'EXCELLENT',
    nowMs: 42,
    baselineMs: 45,
    uptimePercent: 100,
    devices: [
      { id: 'LT-03', label: 'LT-03', detail: '· Sales · assigned: Priya', active: true, status: 'Active now · in Salesforce since 8:41', time: '3h 12m', volume: '840 MB' },
      { id: 'LT-04', label: 'LT-04', detail: '· Sales · assigned: Dev', active: true, status: 'Active now', time: '2h 05m', volume: '610 MB' },
      { id: 'DT-04', label: 'DT-04', detail: '· GM office', active: false, status: 'Last active 8:55', time: '24m', volume: '95 MB' },
      { id: 'LT-08', label: 'LT-08', detail: '· Accounting', active: false, status: 'Last active yesterday · reports only', time: '—', volume: '—' },
    ],
    deviceNote: '4 more devices used Salesforce this month · full list in Insights.',
  },
  {
    id: 'pm',
    name: 'PowerofM',
    abbreviation: 'M',
    color: '#e0a458',
    tag: 'MARRIOTT PMS · PRIORITY WATCH 2–6 PM CHECK-IN',
    meta: "Marriott GPO / property systems · 4 permitted devices · click for who's on it",
    verdict: 'excellent',
    verdictLabel: 'EXCELLENT',
    nowMs: 61,
    baselineMs: 58,
    uptimePercent: 99.99,
    devices: [
      { id: 'DT-01', label: 'DT-01', detail: '· Front desk · assigned: Maria', active: true, status: 'Active now · 3 PMS sessions · logged in since 7:02', time: '6h 40m', volume: '1.4 GB' },
      { id: 'DT-02', label: 'DT-02', detail: '· Front desk · shared', active: true, status: 'Active now · 1 session', time: '4h 15m', volume: '890 MB' },
      { id: 'LT-05', label: 'LT-05', detail: '· GM office', active: false, status: 'Last active 8:30 · reports & night audit review', time: '38m', volume: '120 MB' },
      { id: 'DT-05', label: 'DT-05', detail: '· Engineering', active: false, status: 'Last active yesterday · read-only', time: '—', volume: '—' },
    ],
    allowListNote:
      '<b>◈ Access is allow-listed:</b> only these 4 devices may reach PowerofM — any other device attempting it is blocked and flagged to you. Last blocked attempt: none in 90 days. Every session above ties to the device owner you set at registration.',
  },
  {
    id: 'sn',
    name: 'ServiceNow',
    abbreviation: 'Sn',
    color: '#2dd4a7',
    tag: 'TICKETING',
    meta: 'servicenow.com · used by 4 devices',
    verdict: 'degraded',
    verdictLabel: 'DEGRADED — THEIR SIDE',
    nowMs: 214,
    baselineMs: 86,
    uptimePercent: 99.7,
    devices: [
      { id: 'LT-07', label: 'LT-07', detail: '· Maintenance', active: true, status: 'Active now — affected by the slowdown', time: '1h 20m', volume: '210 MB' },
      { id: 'DT-03', label: 'DT-03', detail: '· Back office', active: false, status: 'Last active 8:12', time: '15m', volume: '40 MB' },
      { id: 'LT-01/02', label: 'LT-01, LT-02', detail: '· Front desk', active: false, status: 'Occasional use · not active today', time: '—', volume: '—' },
    ],
    pathBreakdown: {
      hops: [
        { label: 'Your LAN', latencyMs: 1, warn: false },
        { label: 'Firewall', latencyMs: null, warn: false },
        { label: 'Bell', latencyMs: 8, warn: false },
        { label: 'Internet path', latencyMs: 21, warn: false, incremental: true },
        { label: 'ServiceNow', latencyMs: 184, warn: true, incremental: true },
      ],
      conclusion_html:
        "<b>The slowdown is inside ServiceNow's network — nothing on your side to fix.</b> Their status page confirms elevated latency since 08:40. Evidence pack logged at 09:02 for SLA purposes. Your staff may see slow ticket loads; we'll clear the flag automatically when their response returns to baseline.",
    },
  },
]

const SEED_INCIDENTS: IspIncident[] = [
  {
    date: 'Jul 12',
    message_html:
      '<b>Bell latency spiked to 210 ms</b> for 14 min at 03:12. Auto-failover to LTE in 800 ms. <span class="save">Your business felt nothing.</span> Incident report filed with Bell — credit requested.',
  },
  {
    date: 'Jun 28',
    message_html:
      '<b>Regional Bell outage</b> (2 h 40 min, Vaughan area). Ran on LTE backup the entire window; POS, door access and cameras stayed online. <span class="save">Estimated $3,800 in avoided lost sales.</span>',
  },
  {
    date: 'Jun 09',
    message_html:
      "<b>Speed degradation detected</b> — sustained 610 Mbps vs 940 Mbps provisioned. Ticket escalated with our carrier evidence pack; Bell replaced ONT Jun 11. <b>You didn't have to call anyone.</b>",
  },
  {
    date: 'May 17',
    message_html:
      '<b>DNS resolver slowness</b> at Bell (avg 340 ms). Traffic shifted to our filtered resolvers automatically. Browsing stayed instant.',
  },
]

export const mockWanApi: WanApi = {
  async getStatus() {
    return delay({ ...SEED_STATUS, primary: { ...SEED_STATUS.primary }, backup: { ...SEED_STATUS.backup } })
  },

  async getLatencySeries() {
    return delay(buildLatencySeries())
  },

  async listCloudApps() {
    return delay(SEED_CLOUD_APPS.map((a) => ({ ...a, devices: a.devices.map((d) => ({ ...d })) })))
  },

  async listIspIncidents() {
    return delay(SEED_INCIDENTS.map((i) => ({ ...i })))
  },

  subscribePrimaryLatency(onTick) {
    const id = setInterval(() => {
      onTick(7.6 + Math.random() * 1.6)
    }, 2000)
    return () => clearInterval(id)
  },

  subscribeCloudAppLatency(onTick) {
    const id = setInterval(() => {
      onTick('sf', 40 + Math.random() * 7)
      onTick('pm', 57 + Math.random() * 9)
      onTick('sn', 200 + Math.random() * 30)
    }, 3000)
    return () => clearInterval(id)
  },
}
