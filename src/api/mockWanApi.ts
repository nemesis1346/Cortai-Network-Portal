import type { LatencyPoint, LatencySeries, WanApi } from './wanTypes'
import { rng } from './seededRandom'
import { unavailable } from './unavailableError'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
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

export const mockWanApi: WanApi = {
  getStatus() {
    return unavailable('No WAN probe agent is deployed at this site yet — latency, jitter, loss and uptime require it.')
  },

  async getLatencySeries() {
    return delay(buildLatencySeries())
  },

  listCloudApps() {
    return unavailable('No cloud-app health integration is configured for this site yet.')
  },

  listIspIncidents() {
    return unavailable('No ISP incident feed is configured for this site yet.')
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
