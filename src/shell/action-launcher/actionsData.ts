export type ActionEffect =
  | { kind: 'toast'; message: string }
  | { kind: 'navigate'; tab: string; message?: string }
  /** The one "Block a website" case — navigates to Controls and focuses its domain input. */
  | { kind: 'navigate-focus-block' }
  /** The 8 "crFrom"-equivalent actions — navigates to Controls and pre-fills (not submits) the Guardian textarea. */
  | { kind: 'guardian-prefill'; prefix: string }

export interface ActionItem {
  id: string
  category: string
  icon: string
  color: string
  tierBadge: 'inst' | 'guid' | 'eng'
  title: string
  description: string
  keywords: string
  effect: ActionEffect
}

/** Ported verbatim from cortai-network-topology.html's ACTIONS array (lines 2395-2441) — all 20 entries. */
export const ACTIONS: ActionItem[] = [
  // Wi-Fi & guests
  {
    id: 'change-guest-wifi-password',
    category: 'Wi-Fi & guests',
    icon: '🔑',
    color: '#8b7cf6',
    tierBadge: 'inst',
    title: 'Change guest Wi-Fi password',
    description: 'New password pushed to the guest network instantly; staff network untouched',
    keywords: 'wifi guest password change rotate',
    effect: { kind: 'toast', message: 'New guest password generated & applied — printable card ready to download' },
  },
  {
    id: 'guest-wifi-qr-poster',
    category: 'Wi-Fi & guests',
    icon: '▦',
    color: '#8b7cf6',
    tierBadge: 'inst',
    title: 'Get a guest Wi-Fi QR poster',
    description: 'Printable QR code — guests scan to join, no password to read out',
    keywords: 'wifi qr code poster guest print',
    effect: { kind: 'toast', message: 'QR poster generated — guests scan & join LIONSTON-GUEST' },
  },
  {
    id: 'toggle-guest-wifi',
    category: 'Wi-Fi & guests',
    icon: '⏻',
    color: '#8b7cf6',
    tierBadge: 'inst',
    title: 'Turn guest Wi-Fi on / off',
    description: 'Kill or restore the guest network with one tap',
    keywords: 'wifi guest disable enable off on pause',
    effect: { kind: 'navigate', tab: 'controls', message: 'Guest Wi-Fi controls opened' },
  },
  {
    id: 'fix-wifi-dead-zone',
    category: 'Wi-Fi & guests',
    icon: '📶',
    color: '#8b7cf6',
    tierBadge: 'eng',
    title: 'Fix a Wi-Fi dead zone',
    description: 'Tell us where signal is weak — we survey and add or move an access point',
    keywords: 'wifi weak signal dead zone coverage slow extend',
    effect: { kind: 'guardian-prefill', prefix: 'Wi-Fi coverage issue: ' },
  },
  // Devices
  {
    id: 'add-new-device',
    category: 'Devices',
    icon: '＋',
    color: '#2dd4a7',
    tierBadge: 'guid',
    title: 'Add a new device',
    description: 'Printer, camera, TV, terminal — we place it on the right network safely',
    keywords: 'add device new printer camera tv approve connect',
    effect: { kind: 'guardian-prefill', prefix: 'New device to add: ' },
  },
  {
    id: 'pause-device-internet',
    category: 'Devices',
    icon: '⏸',
    color: '#2dd4a7',
    tierBadge: 'inst',
    title: 'Pause internet for a device',
    description: "Cut one device's access for an hour — auto-restores",
    keywords: 'pause device block laptop internet cut suspend',
    effect: { kind: 'navigate', tab: 'controls', message: 'Pick the device to pause in Controls' },
  },
  {
    id: 'rename-device',
    category: 'Devices',
    icon: '✎',
    color: '#2dd4a7',
    tierBadge: 'inst',
    title: 'Rename a device / assign an owner',
    description: 'Turn "DESKTOP-K83F" into "Front desk 2 — Maria"',
    keywords: 'rename device label owner assign name',
    effect: { kind: 'toast', message: 'Pick any device on the Network map to rename it' },
  },
  {
    id: 'retire-device',
    category: 'Devices',
    icon: '🗑',
    color: '#2dd4a7',
    tierBadge: 'guid',
    title: 'Retire a device',
    description: 'Remove it from the network and revoke its access everywhere',
    keywords: 'remove retire delete device old decommission',
    effect: { kind: 'guardian-prefill', prefix: 'Device to retire: ' },
  },
  {
    id: 'restart-equipment',
    category: 'Devices',
    icon: '⟳',
    color: '#2dd4a7',
    tierBadge: 'inst',
    title: 'Restart equipment safely',
    description: 'Reboot a camera, AP or switch port without touching anything physical',
    keywords: 'restart reboot power cycle camera ap frozen stuck',
    // Mockup targets 'topo' (Network/Topology, M2) — not built, our closest real screen is 'network'.
    effect: { kind: 'navigate', tab: 'network', message: 'Click any device on the map, then use its restart action' },
  },
  // People
  {
    id: 'onboard-employee',
    category: 'People',
    icon: '👋',
    color: '#5aa9e6',
    tierBadge: 'guid',
    title: 'Onboard a new employee',
    description: 'Wi-Fi access, device setup, and the right permissions — one flow',
    keywords: 'new employee hire onboard staff person add user',
    effect: { kind: 'guardian-prefill', prefix: 'New employee starting: name, start date, and what they need — ' },
  },
  {
    id: 'offboard-employee',
    category: 'People',
    icon: '🚪',
    color: '#5aa9e6',
    tierBadge: 'guid',
    title: 'Offboard an employee',
    description: 'Revoke Wi-Fi, VPN, and device access everywhere at once — same day',
    keywords: 'offboard remove employee leaver terminate revoke fired quit',
    effect: { kind: 'guardian-prefill', prefix: 'Employee leaving — revoke access for: ' },
  },
  {
    id: 'vendor-temp-access',
    category: 'People',
    icon: '🔓',
    color: '#5aa9e6',
    tierBadge: 'guid',
    title: 'Give a vendor temporary access',
    description: 'POS support, HVAC contractor, PMS vendor — scoped access that expires on its own',
    keywords: 'vendor remote access temporary contractor support pos third party',
    effect: { kind: 'guardian-prefill', prefix: 'Vendor access request: who, to what system, and for how long — ' },
  },
  {
    id: 'revoke-vendor-access',
    category: 'People',
    icon: '🔒',
    color: '#5aa9e6',
    tierBadge: 'inst',
    title: 'Revoke vendor access now',
    description: 'End any active vendor session immediately',
    keywords: 'revoke vendor access end remove cut session',
    effect: { kind: 'toast', message: 'No active vendor sessions right now — last one expired Jul 09' },
  },
  // Security
  {
    id: 'block-website',
    category: 'Security',
    icon: '⛔',
    color: '#f0564a',
    tierBadge: 'inst',
    title: 'Block a website',
    description: 'Applies to every business device in seconds',
    keywords: 'block website site domain gambling social',
    effect: { kind: 'navigate-focus-block' },
  },
  {
    id: 'unblock-site',
    category: 'Security',
    icon: '✔',
    color: '#f0564a',
    tierBadge: 'inst',
    title: 'Unblock a site we caught by mistake',
    description: 'False positive? Whitelist it — logged so the filter learns',
    keywords: 'unblock whitelist allow site false positive blocked wrongly',
    effect: { kind: 'guardian-prefill', prefix: 'Please unblock this site (business reason): ' },
  },
  {
    id: 'report-suspicious-email',
    category: 'Security',
    icon: '✉',
    color: '#f0564a',
    tierBadge: 'guid',
    title: 'Report a suspicious email',
    description: 'Forward it to us — we detonate it safely and block the sender network-wide',
    keywords: 'phishing suspicious email scam report attachment link',
    effect: { kind: 'toast', message: 'Forward it to security@cortai.io — we analyze within 15 min and block if malicious' },
  },
  {
    id: 'think-we-were-hacked',
    category: 'Security',
    icon: '🚨',
    color: '#f0564a',
    tierBadge: 'guid',
    title: "I think we've been hacked",
    description: 'One tap: isolates suspect devices, preserves evidence, engineer calls you inside 15 minutes',
    keywords: 'hacked breach compromised ransomware emergency panic incident',
    effect: {
      kind: 'toast',
      message: 'Incident mode: this would isolate affected VLANs and page the on-call engineer immediately',
    },
  },
  // Internet & equipment
  {
    id: 'run-speed-test',
    category: 'Internet & equipment',
    icon: '⚡',
    color: '#e0a458',
    tierBadge: 'inst',
    title: 'Run a speed test',
    description: "Test from your firewall — the number your ISP can't argue with",
    keywords: 'speed test slow internet bandwidth check',
    effect: { kind: 'toast', message: 'Speed test from FortiGate: 938↓ / 856↑ Mbps · 8.1 ms — matches what you pay for' },
  },
  {
    id: 'test-backup-internet',
    category: 'Internet & equipment',
    icon: '🔀',
    color: '#e0a458',
    tierBadge: 'inst',
    title: 'Test the backup internet',
    description: 'Verify LTE failover is ready without any disruption',
    keywords: 'backup failover lte test internet secondary',
    effect: { kind: 'toast', message: 'LTE backup verified: 36 ms, healthy — last real failover Jun 28, 0 s downtime felt' },
  },
  {
    id: 'schedule-maintenance',
    category: 'Internet & equipment',
    icon: '🌙',
    color: '#e0a458',
    tierBadge: 'eng',
    title: 'Schedule maintenance / planned downtime',
    description: 'Renovation, electrical work, moving a room — we plan the network side',
    keywords: 'maintenance schedule downtime planned renovation move electrical',
    effect: { kind: 'guardian-prefill', prefix: 'Planned work: what, where, and when — ' },
  },
]
