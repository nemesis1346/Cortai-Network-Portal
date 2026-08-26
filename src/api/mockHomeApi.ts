import type { AttentionItem, BriefingGreeting, HomeApi, HomeHealth, HomeKpis } from './homeTypes'
import { subscribeToActivityFeed } from './mockActivityFeed'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

const SEED_KPIS: HomeKpis = {
  attacks: 43,
  attacks_trend: { direction: 'down', percent: 4.2 },
  downtime_min: 0,
  downtime_trend: { direction: 'up', percent: 8.1 },
  devices_protected: 29,
  self_healed: 17,
  self_healed_trend: { direction: 'down', percent: 4.2 },
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
      sub_html: '<b class="c-success">28 online</b> · <b class="c-danger">CAM-04 offline</b> · 3 awaiting registration',
      tab: 'network',
      trend: { direction: 'down', percent: 2 },
    },
    {
      key: 'security',
      label: 'Security',
      stat: '43 blocked',
      sub_html: 'today so far · <b class="c-success">no incidents</b> · grade A',
      tab: 'security',
      trend: { direction: 'down', percent: 1.3 },
    },
    {
      key: 'internet',
      label: 'Internet',
      stat: '8.2 ms',
      sub_html: '<b class="c-success">Bell healthy</b> · apps 2/3 at baseline · 99.98% uptime',
      tab: 'wan-health',
      trend: { direction: 'up', percent: 3.7 },
    },
    {
      key: 'insights',
      label: 'Insights',
      stat: 'Peak: Tue 10am',
      sub_html: '78% business apps · streaming ×3 after 6 PM',
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
    detail: 'no PoE draw on port 11 · remote reset queued, tech dispatched if no recovery by 10:30',
    elapsed: '42 min ago',
    tab: 'network',
  },
  {
    id: 'shadow-it-sync',
    severity: 'med',
    title: 'Personal file-sync app on 2 laptops',
    detail: '40 GB/mo · flagged as shadow IT · awaiting your policy decision in Controls',
    elapsed: '42 min ago',
    tab: 'controls',
  },
  {
    id: 'maintenance-window',
    severity: 'med',
    title: 'Firmware maintenance window · Sun 20 Jul, 2–4 AM',
    detail: 'Switch + AP updates scheduled · zero expected downtime · no action needed',
    elapsed: '1h 30 min ago',
    tab: 'network',
  },
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

export const mockHomeApi: HomeApi = {
  async getBriefing() {
    const now = new Date()
    return delay({
      greeting: greetingFor(now.getHours()),
      day_label: now.toLocaleDateString('en-CA', { weekday: 'long' }),
      narrative_html: buildNarrative(now),
      chips: [
        { label: 'View camera', tab: 'network' },
        { label: 'View blocked', tab: 'security' },
        { label: "Today's traffic", tab: 'wan-health' },
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

  subscribeActivity(onEvent) {
    return subscribeToActivityFeed(onEvent, 7000)
  },
}
