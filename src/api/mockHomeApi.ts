import type {
  ActivityEvent,
  ActivityEventKind,
  AttentionItem,
  BriefingGreeting,
  HomeApi,
  HomeHealth,
  HomeKpis,
} from './homeTypes'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

const SEED_KPIS: HomeKpis = {
  attacks: 43,
  downtime_min: 0,
  devices_protected: 29,
  self_healed: 17,
}

const SEED_HEALTH: HomeHealth = {
  score: 97,
  status: 'All systems operational',
  contributors: ['1 device fault contained', 'no security incidents', 'WAN healthy'],
  sections: [
    {
      key: 'network',
      label: 'Network',
      stat: '29 devices',
      sub: '28 online · CAM-04 offline',
      tab: 'network',
    },
    {
      key: 'security',
      label: 'Security',
      stat: '43 blocked',
      sub: 'today so far · no incidents · grade A',
      tab: 'security',
    },
    {
      key: 'internet',
      label: 'Internet',
      stat: '8.2 ms',
      sub: 'Bell healthy · apps 2/3 at baseline · 99.98% uptime',
      tab: 'wan-health',
    },
    {
      key: 'insights',
      label: 'Insights',
      stat: 'Peak: Tue 10 AM',
      sub: '78% business apps · streaming ×3 after 6 PM',
      tab: 'insights',
    },
  ],
}

/**
 * Ported from cortai-network-topology.html's #scr-home .alert-item block.
 * CAM-04 has no drill-down target in this app (M2 Topology isn't built), so it
 * points at the Network tab — a real screen — rather than a fabricated detail view.
 */
const SEED_ATTENTION: AttentionItem[] = [
  {
    id: 'cam-04-offline',
    severity: 'hi',
    title: 'CAM-04 · Loading dock camera offline',
    detail:
      '42 min · no PoE draw on port 11 · remote reset queued, tech dispatched if no recovery by 10:30',
    tab: 'network',
  },
  {
    id: 'shadow-it-sync',
    severity: 'med',
    title: 'Personal file-sync app on 2 laptops',
    detail: '40 GB/mo · flagged as shadow IT · awaiting your policy decision in Controls',
    tab: 'controls',
  },
  {
    id: 'maintenance-window',
    severity: 'med',
    title: 'Firmware maintenance window · Sun 20 Jul, 2–4 AM',
    detail: 'Switch + AP updates scheduled · zero expected downtime · no action needed',
    tab: 'network',
  },
]

/** Ported verbatim from cortai-network-topology.html's FEED_POOL. */
const SEED_FEED_POOL: [ActivityEventKind, string][] = [
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

function greetingFor(hour: number): BriefingGreeting {
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

const GREETING_LABEL: Record<BriefingGreeting, string> = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
}

function buildNarrative(now: Date): string {
  const greet = GREETING_LABEL[greetingFor(now.getHours())]
  const day = now.toLocaleDateString('en-CA', { weekday: 'long' })
  return (
    `${greet}. Quiet night on your network — I blocked <b>214 connection attempts</b> while you were closed, all routine background noise from the internet. ` +
    `<span class="warn">One thing needs attention:</span> the loading-dock camera (<b>CAM-04</b>) went dark at <b>8:47</b> — its switch port shows no power draw, so this looks like a cable or injector fault, not tampering. A remote reset is queued, and a technician goes on site at <b>10:30</b> if it doesn't recover. ` +
    `Everything else — internet, Wi-Fi, door access, POS — is healthy, and traffic looks normal for a ${day}.`
  )
}

let activityCounter = 0

export const mockHomeApi: HomeApi = {
  async getBriefing() {
    const now = new Date()
    return delay({
      greeting: greetingFor(now.getHours()),
      day_label: now.toLocaleDateString('en-CA', { weekday: 'long' }),
      narrative_html: buildNarrative(now),
      chips: [
        { label: 'View camera →', tab: 'network' },
        { label: 'See what was blocked →', tab: 'security' },
        { label: "Today's traffic →", tab: 'insights' },
      ],
      generated_at: now.toISOString(),
    })
  },

  async getKpis() {
    return delay({ ...SEED_KPIS })
  },

  async getHealth() {
    return delay({ ...SEED_HEALTH, sections: SEED_HEALTH.sections.map((s) => ({ ...s })) })
  },

  async listAttention() {
    return delay(SEED_ATTENTION.map((a) => ({ ...a })))
  },

  subscribeActivity(onEvent: (event: ActivityEvent) => void) {
    const id = setInterval(() => {
      const [kind, message_html] = SEED_FEED_POOL[Math.floor(Math.random() * SEED_FEED_POOL.length)]
      activityCounter += 1
      onEvent({
        id: `evt-${Date.now()}-${activityCounter}`,
        kind,
        message_html,
        at: new Date().toISOString(),
      })
    }, 7000)
    return () => clearInterval(id)
  },
}
