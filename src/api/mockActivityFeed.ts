import type { ActivityEvent, ActivityEventKind } from './homeTypes'

/**
 * Ported verbatim from cortai-network-topology.html's FEED_POOL — the mockup uses
 * this exact same 10-entry pool for both Command Center's home feed and Security's
 * threat feed (different DOM target, row cap, and interval per screen, same data).
 */
export const ACTIVITY_FEED_POOL: [ActivityEventKind, string][] = [
  ['blk', '<b>Log4Shell scan</b> from <span class="mono">185.220.101.44</span> (RU) → WAN. Signature matched, dropped.'],
  ['blk', 'SSH password spray from <span class="mono">43.155.68.9</span> (CN) — <b>62 attempts</b>, source banned.'],
  ['blk', 'DT-02 tried to open <span class="mono">micros0ft-billing.top</span> — <b>credential phishing</b>, page never loaded.'],
  ['qtn', 'Email attachment <span class="mono">invoice_(2).xlsm</span> detonated in sandbox — <b>macro dropper</b> detected.'],
  ['blk', 'CAM-02 firmware attempted contact with known C2 <span class="mono">91.243.44.12</span> — <b>blocked by IoT policy</b>.'],
  ['blk', 'Sequential scan of 1,024 ports from <span class="mono">167.94.138.60</span> — fingerprinted as Censys, rate-limited.'],
  ['alw', 'Windows Update on LT-04 — publisher signature valid, allowed.'],
  ['blk', 'LT-07 blocked from <b>malvertising redirect</b> on a news site (<span class="mono">adclick-cdn.ru</span>).'],
  ['blk', 'Anomalous TXT query volume from guest device — <b>DNS exfil pattern</b>, killed.'],
  ['qtn', 'Unknown MAC on port 15 placed in <b>quarantine VLAN</b> pending approval.'],
]

let activityCounter = 0

/** Simulates a live feed subscription by picking a random pool entry every `intervalMs`. */
export function subscribeToActivityFeed(onEvent: (event: ActivityEvent) => void, intervalMs: number): () => void {
  const id = setInterval(() => {
    const [kind, message_html] = ACTIVITY_FEED_POOL[Math.floor(Math.random() * ACTIVITY_FEED_POOL.length)]
    activityCounter += 1
    onEvent({
      id: `evt-${Date.now()}-${activityCounter}`,
      kind,
      message_html,
      at: new Date().toISOString(),
    })
  }, intervalMs)
  return () => clearInterval(id)
}
