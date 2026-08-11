export interface WanPrimaryStatus {
  latencyMs: number
  jitterMs: number
  lossPercent: number
  downMbps: number
  upMbps: number
}

export interface WanBackupStatus {
  latencyMs: number
  state: string
  activations90d: number
  downtimeFeltSec: number
}

export interface WanStatus {
  primary: WanPrimaryStatus
  backup: WanBackupStatus
  uptime90dPercent: number
}

export interface LatencyPoint {
  index: number
  ms: number
}

export interface LatencySeries {
  points: LatencyPoint[]
  maxMs: number
  thresholdMs: number
  spikeStartIndex: number
  spikeEndIndex: number
  annotation: string
}

export interface CloudAppDevice {
  id: string
  label: string
  detail: string
  active: boolean
  status: string
  time: string
  volume: string
}

export interface CloudAppPathHop {
  label: string
  latencyMs: number | null
  warn: boolean
  /** Renders latencyMs with a "+" prefix — the hop's incremental contribution vs. total. */
  incremental?: boolean
}

export type CloudAppVerdict = 'excellent' | 'degraded'

export interface CloudApp {
  id: string
  name: string
  abbreviation: string
  color: string
  tag: string
  meta: string
  verdict: CloudAppVerdict
  verdictLabel: string
  nowMs: number
  baselineMs: number
  uptimePercent: number
  devices: CloudAppDevice[]
  allowListNote?: string
  pathBreakdown?: { hops: CloudAppPathHop[]; conclusion_html: string }
  deviceNote?: string
}

export interface IspIncident {
  date: string
  message_html: string
}

export interface WanApi {
  getStatus(): Promise<WanStatus>
  getLatencySeries(): Promise<LatencySeries>
  listCloudApps(): Promise<CloudApp[]>
  listIspIncidents(): Promise<IspIncident[]>
  /** 2s cadence, plain Math.random (not seeded) — meant to feel live, not be reproducible. */
  subscribePrimaryLatency(onTick: (ms: number) => void): () => void
  /** 3s cadence, all 3 apps per tick. */
  subscribeCloudAppLatency(onTick: (id: string, ms: number) => void): () => void
}
