import type { LateralEvent, ProtectionStackItem, SecurityApi, SecurityKpis, SimulationScenario } from './securityTypes'
import { subscribeToActivityFeed } from './mockActivityFeed'
import { unavailable } from './unavailableError'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

const SEED_KPIS: SecurityKpis = {
  threats_blocked_30d: 1284,
  intrusion_attempts: 214,
  malware_stopped: 37,
  phishing_blocked: 96,
  grade: 'A',
}

const SEED_PROTECTION_STACK: ProtectionStackItem[] = [
  { label: 'Next-gen firewall', detail: 'FortiGate 40F · FortiOS 7.4.5' },
  { label: 'Intrusion prevention', detail: 'Definitions updated 2 h ago' },
  { label: 'Anti-malware + sandbox', detail: 'Cloud detonation for unknown files' },
  { label: 'Web & DNS filtering', detail: 'Phishing / botnet / adult blocked' },
  { label: 'Application control', detail: 'Shadow-IT visibility per device' },
  { label: 'Network segmentation', detail: 'Cameras & door access isolated' },
]

const SEED_LATERAL_EVENTS: LateralEvent[] = [
  {
    id: 'lt-07-scan',
    severity: 'hi',
    message_html: '<b>LT-07 scanned 12 internal hosts</b> on the file-sharing port (445) · Tue 22:41',
    action_html:
      '<span class="act">blocked at first probe</span> · same device already flagged for shadow IT — watch tightened, baseline alert armed',
  },
  {
    id: 'breakroom-tv-probe',
    severity: 'med',
    message_html: '<b>Breakroom TV probed for corp devices</b> (discovery broadcasts ×2)',
    action_html: '<span class="act">absorbed by media isolation</span> — this is why it didn\'t go on the corporate network',
  },
  {
    id: 'cam-02-reach',
    severity: 'med',
    message_html: '<b>CAM-02 firmware reached toward corp subnet</b> once',
    action_html: '<span class="act">blocked</span> · firmware update queued for the Sun 20 Jul window',
  },
  {
    id: 'guest-gateway-probe',
    severity: 'lo',
    message_html: '<b>Guest devices probed the gateway</b> 7× — normal internet background behavior from guest phones',
    action_html: '<span class="act">blocked, no action needed</span>',
  },
]

const SEED_SIMULATION: SimulationScenario = {
  steps: [
    {
      time: '23:41:02',
      description:
        'Link up on switch port 11 — the loading-dock camera port. CAM-04 was unplugged 4 s earlier (camera-offline alert already fired: the attack announces itself before it starts).',
      tone: 'warn',
    },
    {
      time: '+0.4 s',
      description:
        'Unknown MAC — Intel laptop NIC, not a camera vendor. NAC verdict: quarantine VLAN, zero LAN, zero internet. The attacker is in a padded room.',
      tone: 'ok',
    },
    {
      time: '+3.0 s',
      description:
        'Device re-connects spoofing CAM-04’s MAC. Fingerprint mismatch: Linux laptop ≠ camera firmware (wrong DHCP options, wrong protocols). Spoof flagged.',
      tone: 'warn',
    },
    { time: '+3.1 s', description: 'Port 11 administratively shut · PoE cut. The jack is now dead copper.', tone: 'ok' },
    {
      time: '+3.5 s',
      description: 'Scan attempt captured from the quarantine window — ARP sweep, went nowhere. Preserved as evidence.',
      tone: 'warn',
    },
    {
      time: '+5 s',
      description:
        'Evidence pack sealed: MAC, fingerprint, packet capture · CAM-05 (rear exit) footage bookmarked ±5 minutes around the event.',
      tone: 'ok',
    },
    {
      time: '+6 s',
      description: 'You + on-call engineer notified: possible physical intrusion at the loading dock — check the door, not the network.',
      tone: 'ok',
    },
  ],
  verdict: 'BLAST RADIUS: ZERO',
  message_html:
    'The attacker reached a quarantine VLAN and then a dead port. Corp, cameras, door access, and POS were never touchable — camera ports have <b>no route to Corp to begin with</b> (see the east-west matrix above). Total time from plug-in to dead jack: <b>3.1 seconds</b>. The remaining risk is physical, and a human is already on it.',
  journal_title: 'Contained: rogue device on camera port 11 (simulation)',
  journal_rationale:
    'A non-camera device appeared on a camera-bound port, then attempted MAC spoofing. Containment is autonomous; the port was shut and evidence preserved. Physical response and remediation are human (Tier 4).',
  verify: [
    'Port 11 down, PoE off',
    'Attacker never left quarantine — zero packets reached Corp, Cameras, or POS',
    'Evidence pack + camera footage preserved',
  ],
}

export const mockSecurityApi: SecurityApi = {
  async getKpis() {
    return delay({ ...SEED_KPIS })
  },

  async getProtectionStack() {
    return delay(SEED_PROTECTION_STACK.map((s) => ({ ...s })))
  },

  getAttackOrigins() {
    return unavailable("No threat-intelligence feed is wired up yet — attack-origin geolocation isn't available.")
  },

  getEastWestMatrix() {
    return unavailable("No switch/segment telemetry is configured yet — east-west traffic can't be measured.")
  },

  async listLateralEvents() {
    return delay(SEED_LATERAL_EVENTS.map((e) => ({ ...e })))
  },

  async getSimulationScenario() {
    return delay({ ...SEED_SIMULATION, steps: SEED_SIMULATION.steps.map((s) => ({ ...s })), verify: [...SEED_SIMULATION.verify] })
  },

  subscribeThreatFeed(onEvent) {
    return subscribeToActivityFeed(onEvent, 5000)
  },
}
