import type {
  ChangeRecord,
  ChangeStep,
  ControlsApi,
  GuardTier,
  PolicyToggle,
  ReverseKind,
  TriageIntent,
  TriageResult,
} from './controlsTypes'
import { TIER_LABEL } from './controlsTypes'

const NETWORK_DELAY_MS = 260
/** Matches the mockup's runPlan per-step interval — kept in sync with useStepRunner's default. */
const PER_STEP_MS = 620

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function stepAnimationDelay(stepCount: number): number {
  return stepCount * PER_STEP_MS + 300
}

interface InternalDiag {
  res: string
  cls: 'ok' | 'ask' | 'esc'
  find: [('ok' | 'warn'), string][]
  msg: string
  askActions?: boolean
}

interface InternalIntent {
  id: string
  rx: RegExp
  tier: GuardTier
  what: string
  plan: string[]
  secs: number
  pw?: boolean
  diag?: InternalDiag
}

/** Ported verbatim from cortai-network-topology.html:2157-2158. */
const TIER4_RX =
  /\b(install|mount|cable|cabling|hardware|replace|swap|dead ?zone|coverage|site survey|new (ap|access point|switch|camera|hardware)|door|keypad|access control|move (the )?(office|network)|renovat)\b/i
const TIER3_RX =
  /\b(port forward|open (a )?port|nat\b|vlan|ssid|vpn|tunnel|static ip|firewall (rule|policy)|segment|network for|new (network|wifi|wi-fi))\b/i

const TIER_META: Record<GuardTier, { msg: string; btn?: (secs: number) => string }> = {
  1: {
    msg: 'This is within my <b>autonomous scope</b> — bounded, reversible, and verified. I’d normally handle it without asking; confirm and I’ll run it now.',
    btn: (s) => `Run it now — ~${s} s`,
  },
  2: {
    msg: 'I can execute this flawlessly, but the <b>decision is a business call, not a technical one</b> — so it’s yours. One tap and it’s done, reversible for 30 days.',
    btn: (s) => `Approve — apply in ~${s} s`,
  },
  3: {
    msg: 'This changes your network’s <b>attack surface or structure</b>, so a certified engineer reviews and applies it. I’ve prepared the full change plan and pre-checks — the engineer starts at step 3, not step 0. Review within 1 business hour.',
  },
  4: {
    msg: 'This needs <b>hands on site or judgment I don’t exercise</b> — physical work, protected systems, or incident remediation. I’ve opened a work order with photos of the area, switch capacity, and cabling paths attached, and we’ll schedule the visit with you.',
  },
}

/** Ported verbatim from GUARD_INTENTS (cortai-network-topology.html:2111-2156) — all 14 entries. */
const GUARD_INTENTS: InternalIntent[] = [
  {
    id: 'rotate-guest-wifi-password',
    rx: /\b(guest)\b.*\b(password|wifi|wi-fi|qr)|\bwifi password\b|\brotate\b.*wi-?fi/i,
    tier: 1,
    pw: true,
    what: 'Rotate guest Wi-Fi password',
    plan: [
      'snapshot config',
      'generate strong passphrase',
      'push to guest SSID only — staff untouched',
      'regenerate printable QR poster',
      'notify front-desk manager (SMS + portal)',
      'verify: test client joins with new passphrase',
    ],
    secs: 12,
  },
  {
    id: 'safe-equipment-restart',
    rx: /\b(restart|reboot|power.?cycle|frozen|stuck|not responding)\b/i,
    tier: 1,
    what: 'Safe equipment restart',
    plan: ['snapshot config', 'run diagnostics (port, PoE, ping)', 'PoE cycle if diagnostics agree', 'verify device rejoins + streams'],
    secs: 90,
  },
  {
    id: 'diagnose-slow-internet',
    rx: /\b(slow|speed test|is (the )?internet)\b/i,
    tier: 1,
    what: 'Diagnose slow internet',
    plan: ['speed test from firewall (ISP-grade evidence)', 'check top talkers + WAN health', 'report back with the actual cause'],
    secs: 35,
  },
  {
    id: 'block-a-website',
    rx: /\b(block|ban|stop)\b.*\b(site|website|\.[a-z]{2,6}\b|social|gambling|youtube|facebook|tiktok)|\.[a-z]{2,6}\b.*\bblock/i,
    tier: 2,
    what: 'Block a website',
    plan: ['snapshot config', 'add domain to business-VLAN blocklist', 'verify with test lookup from a staff device'],
    secs: 8,
  },
  {
    id: 'unblock-a-site',
    rx: /\b(unblock|whitelist|allow|false positive)\b/i,
    tier: 2,
    what: 'Unblock a site',
    plan: ['check domain reputation (clean)', 'snapshot config', 'add to allow-list, business VLANs only', 'verify page loads'],
    secs: 9,
  },
  {
    id: 'pause-a-device',
    rx: /\b(pause|cut|suspend|turn off)\b.*\b(internet|laptop|device|computer|lt-|dt-)|\b(lt|dt)-\d+.*\bpause/i,
    tier: 2,
    what: 'Pause a device',
    plan: ['identify device on network map', 'snapshot config', 'apply deny policy, time-boxed 1 h', 'auto-restore timer set'],
    secs: 5,
  },
  {
    id: 'offboard-access-everywhere',
    rx: /\b(leav(es|ing)|fired|quit|offboard|terminat|last day|revoke)\b/i,
    tier: 2,
    what: 'Offboard access everywhere',
    plan: [
      'snapshot config',
      'revoke Wi-Fi credentials + VPN',
      'deauth active sessions on all APs',
      'quarantine their devices pending handback',
      'verify: no active sessions remain',
      'summary emailed to you',
    ],
    secs: 20,
  },
  {
    id: 'bandwidth-cap',
    rx: /\b(throttle|cap|limit|hogging|slow(ing)? (everyone|us) down)\b/i,
    tier: 2,
    what: 'Bandwidth cap',
    plan: ['confirm device vs its baseline', 'snapshot config', 'apply per-device traffic shaper', 'alert if pattern persists (possible malware)'],
    secs: 7,
  },
  {
    id: 'vendor-temporary-access',
    rx: /\b(vendor|contractor|remote (access|support)|pos (vendor|support)|supplier)\b/i,
    tier: 2,
    what: 'Vendor temporary access',
    plan: [
      'use pre-approved vendor template',
      'snapshot config',
      'scope: their system only, nothing else visible',
      'set auto-expiry — access removes itself',
      'log every session for your records',
    ],
    secs: 15,
  },
  {
    id: 'printer-not-printing',
    rx: /printer.{0,30}(won'?t|not |isn'?t|doesn'?t|stuck|offline|error|print)|(won'?t|can'?t|cannot|doesn'?t).{0,16}\bprint\b/i,
    tier: 1,
    what: 'Printer not printing — diagnose',
    plan: ['find the printer + check its switch port', 'pull DHCP + discovery history', 'test the print path end-to-end', 'apply the fix', 'verify with a test page'],
    secs: 40,
    diag: {
      res: 'FIXED — root cause found',
      cls: 'ok',
      find: [
        ['ok', 'Printer alive on switch port 6 — link + PoE normal'],
        ['warn', 'Its IP address changed after last night’s power blip — every computer was printing to the old address'],
        ['ok', 'Fix applied: permanent IP reservation pinned + discovery (mDNS) refreshed'],
        ['ok', 'Verified: test page printed successfully'],
      ],
      msg: 'This can’t recur — the printer’s address is now reserved. Nobody needs to touch anything.',
    },
  },
  {
    id: 'cant-open-a-website',
    rx: /\b(can'?t|cannot|won'?t|unable to?)\b.{0,24}\b(open|reach|access|load)\b|((web)?site|page).{0,16}(won'?t|not|isn'?t).{0,10}(open|load)/i,
    tier: 1,
    what: 'Can’t open a website — diagnose',
    plan: ['check our filter log for the site', 'test the site from outside your network', 'compare DNS + routing'],
    secs: 15,
    diag: {
      res: 'FOUND IT — needs your OK',
      cls: 'ask',
      find: [
        ['warn', 'The site is blocked by your own content policy: “Social media on staff VLAN, business hours”'],
        ['ok', 'The site itself is up — verified from outside your network'],
        ['ok', 'Nothing is broken — this is policy working exactly as configured'],
      ],
      msg: 'Your call: keep it blocked, or make an exception for the staff VLAN?',
      askActions: true,
    },
  },
  {
    id: 'suspicious-email',
    rx: /\b(scam|phish|suspicious|fake|sketchy)\b.{0,30}(email|e-mail|link|attachment|message)|is this (email|link|message).{0,44}(scam|safe|legit|real|phish)|\b(email|e-mail)\b.{0,44}(scam|suspicious|safe|phish)/i,
    tier: 1,
    what: 'Suspicious email — analyze',
    plan: [
      'detonate the link in a cloud sandbox',
      'check sender domain age + reputation',
      'match against known phishing campaigns',
      'block network-wide if malicious',
      'confirm nobody already clicked',
    ],
    secs: 60,
    diag: {
      res: 'VERDICT: PHISHING — already blocked',
      cls: 'esc',
      find: [
        ['warn', 'Credential-harvest page imitating a Microsoft 365 sign-in'],
        ['warn', 'Sender domain registered 3 days ago, hosted on known-bad infrastructure'],
        ['ok', 'Sender + link now blocked network-wide — nobody can click it'],
        ['ok', 'Log check: no device on your network visited the link'],
      ],
      msg: 'Delete the email. If anyone already typed a password on that page, tell me now and I’ll force a reset on their accounts.',
    },
  },
  {
    id: 'poor-call-quality',
    rx: /\b(calls?|phone|voip|voice)\b.{0,30}(bad|choppy|drop|terrible|cutting|robot|quality|breaking)|(choppy|dropping|garbled).{0,12}(calls?|audio)/i,
    tier: 1,
    what: 'Poor call quality — diagnose',
    plan: ['measure jitter + loss on the voice path', 'check SIP-ALG on the firewall', 'find bandwidth contention during calls', 'apply QoS fix', 'verify with a test call'],
    secs: 50,
    diag: {
      res: 'FIXED — two causes found',
      cls: 'ok',
      find: [
        ['warn', 'SIP-ALG was enabled on the firewall — it mangles call setup; disabled'],
        ['warn', 'LT-07 was streaming video at 14 Mbps on the same uplink during calls'],
        ['ok', 'Voice traffic now priority-queued; heavy streams yield to calls automatically'],
        ['ok', 'Verified with a test call: quality score 3.1 → 4.3 (MOS)'],
      ],
      msg: 'Calls should sound clean now. I’ll watch the voice path for 48 hours and reopen this if quality dips.',
    },
  },
  {
    id: 'device-acting-strange',
    rx: /\b(computer|laptop|pc|machine|desktop)\b.{0,30}(weird|strange|acting|possessed|popup|pop-up|virus|hacked)|weird (popup|pop-up)|think.{0,16}(virus|hacked|malware)/i,
    tier: 1,
    what: 'Device acting strange — contain & inspect',
    plan: ['isolate the device — containment first, questions second', 'inspect its recent traffic for known-bad patterns', 'check DNS queries + outbound destinations', 'preserve evidence for the engineer'],
    secs: 8,
    diag: {
      res: 'CONTAINED — engineer engaged',
      cls: 'esc',
      find: [
        ['warn', 'Suspicious: repeated DNS lookups matching an algorithm-generated pattern — a possible malware beacon'],
        ['ok', 'Device isolated in 2 seconds — it can’t reach anything, and nothing can reach it'],
        ['ok', 'Evidence preserved · on-call engineer paged — remediation is Tier 4, human work'],
      ],
      msg: '<b>Leave the device powered on</b> — turning it off destroys evidence. An engineer calls you within 15 minutes.',
    },
  },
]

function findIntent(id: string | null | undefined): InternalIntent | null {
  return GUARD_INTENTS.find((i) => i.id === id) ?? null
}

function primaryButtonLabel(intent: InternalIntent): string {
  if (intent.pw) return 'Apply now'
  if (intent.diag) return 'Run the diagnosis'
  const meta = TIER_META[intent.tier]
  return meta.btn ? meta.btn(intent.secs) : 'Run it now'
}

function toPublicIntent(intent: InternalIntent): TriageIntent {
  return {
    id: intent.id,
    what: intent.what,
    plan: intent.plan,
    secs: intent.secs,
    isPasswordRotation: Boolean(intent.pw),
    isDiagnostic: Boolean(intent.diag),
    primaryButtonLabel: primaryButtonLabel(intent),
  }
}

function genSnap(): string {
  return `S-${2200 + Math.floor(Math.random() * 80)}`
}

const PASS_WORDS = ['Maple', 'Harbour', 'Cedar', 'Summit', 'Lakeside', 'Aurora', 'Granite', 'Birch', 'Juniper', 'Meadow']
function genPass(): string {
  const a = PASS_WORDS[Math.floor(Math.random() * PASS_WORDS.length)]
  let b = PASS_WORDS[Math.floor(Math.random() * PASS_WORDS.length)]
  while (b === a) b = PASS_WORDS[Math.floor(Math.random() * PASS_WORDS.length)]
  return `${a}-${b}-${10 + Math.floor(Math.random() * 90)}`
}

/** Seeded from CR_STORE (cortai-network-topology.html:2020-2044) — order preserved exactly as authored. */
const SEED_CHANGES: ChangeRecord[] = [
  {
    num: 117,
    tier: 1,
    badge: 'ai',
    title: 'Blocked 3 domains from overnight threat intel',
    when: '02:14 today',
    executor: 'AI Guardian (autonomous)',
    approved: '— (Tier 1)',
    rationale:
      'Overnight threat-intelligence feed flagged three domains as active command-and-control infrastructure. Blocking known C2 is within autonomous scope: bounded, reversible, no business judgment.',
    snapshot: 'S-2199',
    steps: [
      { state: 'ok', label: 'Snapshot config → #S-2199' },
      { state: 'ok', label: 'Added 3 domains to network-wide blocklist' },
      { state: 'ok', label: 'Killed 0 active sessions (none matched)' },
      { state: 'ok', label: 'Verified: test lookups blocked from staff VLAN' },
    ],
    verify: ['Blocklist active on all VLANs', 'No legitimate traffic matched in prior 30 days'],
    reversible: true,
    rkind: 'snapshot',
  },
  {
    num: 118,
    tier: 3,
    badge: 'sched',
    title: 'Port opening for new PMS server',
    when: 'Scheduled — Sun 20 Jul, 2–4 AM window',
    executor: 'S. Novak (engineer)',
    approved: 'You · Jul 15',
    rationale:
      'Inbound port forwarding changes the network’s attack surface — Tier 3 by policy. Guardian prepared the exact rule, exposure analysis, and pre-checks; engineer applies in the maintenance window.',
    snapshot: '— (taken at execution)',
    steps: [
      { state: 'ok', label: 'Guardian: change plan + exposure flags prepared' },
      { state: 'ok', label: 'Guardian: pre-checks passed (no rule conflicts)' },
      { state: 'pend', label: 'Engineer applies in maintenance window' },
      { state: 'pend', label: 'Verification + close-out summary' },
    ],
    verify: ['Pending execution'],
    reversible: true,
    rkind: 'cancel',
  },
  {
    num: 114,
    tier: 3,
    badge: 'done',
    title: 'Conference-room guest SSID',
    when: 'Jul 08',
    executor: 'S. Novak (engineer)',
    approved: 'You · Jul 07',
    rationale: 'New wireless network = structural change (Tier 3). Applied in the maintenance window with a rollback point saved.',
    snapshot: 'S-2141',
    steps: [
      { state: 'ok', label: 'Snapshot config → #S-2141' },
      { state: 'ok', label: 'Created SSID EVENTS-GUEST, isolated segment' },
      { state: 'ok', label: 'Bandwidth cap 20 Mbps/client' },
      { state: 'ok', label: 'Verified: test client joined, isolation confirmed' },
    ],
    verify: ['SSID broadcasting', 'Cannot reach corp or camera VLANs'],
    reversible: true,
    rkind: 'snapshot',
  },
  {
    num: 105,
    tier: 2,
    badge: 'rev',
    title: 'Trial QoS profile for Teams',
    when: 'Jun 22 · reverted after 4 min',
    executor: 'AI Guardian',
    approved: 'You · Jun 22',
    rationale:
      'Trial voice-priority profile. The jitter alarm fired 4 minutes after apply — verification failed, so the Guardian rolled back automatically. This is the rollback discipline working as designed.',
    snapshot: 'S-2098 (restored)',
    steps: [
      { state: 'ok', label: 'Snapshot config → #S-2098' },
      { state: 'ok', label: 'Applied QoS trial profile' },
      { state: 'warn', label: 'Jitter alarm: camera streams degraded' },
      { state: 'ok', label: 'Auto-rollback to #S-2098 · verified clean' },
    ],
    verify: ['Post-rollback: jitter returned to baseline'],
    reversible: false,
    revNote: 'Already rolled back — snapshot #S-2098 restored.',
  },
  {
    num: 102,
    tier: 4,
    badge: 'done',
    title: 'AP installed — 2nd-floor dead zone',
    when: 'Jun 18',
    executor: 'Field technician (Tier 4)',
    approved: 'You · Jun 12',
    rationale: 'Physical work is human-only by policy. Guardian contributed the site evidence: coverage heatmap, switch capacity, cabling path.',
    snapshot: 'S-2085',
    steps: [
      { state: 'ok', label: 'Site survey + mount location confirmed' },
      { state: 'ok', label: 'Cable run + PoE port 18 provisioned' },
      { state: 'ok', label: 'AP adopted, channels calibrated' },
      { state: 'ok', label: 'Verified: dead zone now −52 dBm' },
    ],
    verify: ['Coverage confirmed by post-install survey'],
    reversible: false,
    revNote: 'Physical installation — reversal would be a new Tier 4 work order.',
  },
]

let crCounter = 118
let CR_STORE: ChangeRecord[] = SEED_CHANGES.map((r) => ({ ...r, steps: [...r.steps], verify: [...r.verify] }))

function addCr(rec: Omit<ChangeRecord, 'num' | 'when'> & { when?: string }): ChangeRecord {
  crCounter += 1
  const full: ChangeRecord = { ...rec, num: crCounter, when: rec.when ?? 'Just now' }
  CR_STORE = [full, ...CR_STORE]
  return full
}

const SEED_POLICIES: PolicyToggle[] = [
  { key: 'guest-wifi', label: 'Guest Wi-Fi', detail: 'LIONSTON-GUEST · isolated from business VLANs, 20 Mbps per client cap', on: true },
  { key: 'after-hours', label: 'After-hours lockdown', detail: '11 PM – 5 AM: corp devices blocked from new outbound sessions; cameras & access unaffected', on: true },
  { key: 'quarantine', label: 'Quarantine new devices', detail: 'Unknown devices get internet-only VLAN until you or we approve them', on: true },
  { key: 'social-block', label: 'Block social media on staff VLAN', detail: 'Facebook, Instagram, TikTok, X during business hours (8 AM – 6 PM)', on: false },
  { key: 'strict-filter', label: 'Strict content filter', detail: 'Adds newly-registered domains and unrated sites to the block list', on: true },
]
/** The mockup's toast names don't always match the visible label (tog(this,'New-device quarantine') etc). */
const POLICY_TOAST_NAME: Record<string, string> = {
  quarantine: 'New-device quarantine',
  'social-block': 'Social media block',
}

let policies: PolicyToggle[] = SEED_POLICIES.map((p) => ({ ...p }))
let blockedDomains: string[] = ['solitaire-online.gg', 'freefilesync-cloud.net']

function diagSteps(find: [('ok' | 'warn'), string][]): ChangeStep[] {
  return find.map(([state, label]) => ({ state, label }))
}

export const mockControlsApi: ControlsApi = {
  async triage(description) {
    const v = description.trim()
    let tier: GuardTier
    let reason: TriageResult['reason']
    let intent: InternalIntent | null = null

    if (TIER4_RX.test(v)) {
      tier = 4
      reason = 'tier4-regex'
    } else if (TIER3_RX.test(v)) {
      tier = 3
      reason = 'tier3-regex'
    } else {
      intent = GUARD_INTENTS.find((i) => i.rx.test(v)) ?? null
      if (intent) {
        tier = intent.tier
        reason = 'intent'
      } else {
        tier = 3
        reason = 'fallback'
      }
    }

    return delay({
      reason,
      tier,
      tier_label: TIER_LABEL[tier],
      tier_message_html: TIER_META[tier].msg,
      fallback_note:
        reason === 'fallback' ? 'I’m not confident enough to act on this autonomously — when in doubt, a human decides.' : null,
      intent: intent ? toPublicIntent(intent) : null,
      confidence: reason === 'intent' ? 0.94 : reason === 'fallback' ? 0.35 : 0.85,
      requires_approval: tier === 2,
      description: v,
    })
  },

  async runChange(triage) {
    const intent = findIntent(triage.intent?.id)
    if (!intent) throw new Error('No intent to run — triage a description with a matched intent first.')
    const tier = intent.tier
    const desc = triage.description

    if (intent.diag) {
      const rec = addCr({
        tier,
        badge: 'ai',
        title: `${desc.slice(0, 58)} — ${intent.diag.res.split(' — ')[0].toLowerCase()}`,
        executor: 'AI Guardian (diagnostic)',
        approved: tier === 2 ? 'You · just now' : '— (Tier 1)',
        rationale: `Diagnostic run: ${intent.what.toLowerCase()}. Findings preserved below exactly as gathered.`,
        snapshot: `— (diagnostic, nothing changed)${intent.diag.cls === 'ok' ? ` + fix snapshot #${genSnap()}` : ''}`,
        steps: diagSteps(intent.diag.find),
        verify: [
          intent.diag.cls === 'ok'
            ? 'Fix verified (see findings)'
            : intent.diag.cls === 'ask'
              ? 'No change applied — awaiting your decision'
              : 'Containment verified · escalated',
        ],
        reversible: intent.diag.cls === 'ok',
        rkind: 'snapshot',
        revNote: intent.diag.cls === 'ok' ? null : 'Diagnostics change nothing to reverse.',
      })
      return delay(
        { ...rec, diagnosis: { verdict: intent.diag.res, tone: intent.diag.cls, message: intent.diag.msg, askActions: intent.diag.askActions } },
        stepAnimationDelay(intent.diag.find.length),
      )
    }

    const snap = genSnap()
    const rec = addCr({
      tier,
      badge: 'ai',
      title: desc.slice(0, 64),
      executor: 'AI Guardian',
      approved: tier === 2 ? 'You · just now' : 'You confirmed · just now (Tier 1 scope)',
      rationale:
        (tier === 2
          ? 'Business decision made by you; execution and verification by the Guardian. '
          : 'Within autonomous scope — bounded, reversible, verified. ') + 'Every step below completed with a passing check.',
      snapshot: snap,
      steps: intent.plan.map((p) => ({ state: 'ok' as const, label: p })),
      verify: ['All plan steps verified', 'Post-change state matches intent'],
      reversible: true,
      rkind: 'snapshot',
    })
    const passwordReveal = intent.pw ? { passphrase: genPass() } : undefined
    return delay({ ...rec, passwordReveal }, stepAnimationDelay(intent.plan.length))
  },

  async scheduleChange(triage) {
    const rec = addCr({
      tier: 1,
      badge: 'sched',
      title: triage.description.slice(0, 64),
      when: 'Scheduled — tonight 4:00 AM',
      executor: 'AI Guardian',
      approved: 'You · just now',
      rationale:
        'Rotating the guest passphrase disconnects connected guests, so you chose the 4:00 AM window when the guest network is nearly empty. New passphrase + QR poster will be at the front desk before the morning shift.',
      snapshot: '— (taken at execution)',
      steps: [
        { state: 'pend', label: 'Snapshot config' },
        { state: 'pend', label: 'Generate + push new passphrase (guest SSID only)' },
        { state: 'pend', label: 'Regenerate QR poster' },
        { state: 'pend', label: 'Notify front-desk manager' },
        { state: 'pend', label: 'Verify: test client joins' },
      ],
      verify: ['Pending execution'],
      reversible: true,
      rkind: 'cancel',
    })
    return delay(rec)
  },

  async submitToEngineer(triage) {
    const tier = triage.tier
    const rec = addCr({
      tier,
      badge: 'sub',
      title: triage.description.slice(0, 64),
      executor: tier === 4 ? 'Field technician (pending)' : 'Engineer (pending review)',
      approved: 'Submitted by you · just now',
      rationale:
        tier === 4
          ? 'Physical work or protected systems — human-only by policy. Guardian attached site evidence to the work order.'
          : 'Structural / attack-surface change — Tier 3 by policy. Guardian’s change plan and pre-checks are attached so the engineer starts at step 3.',
      snapshot: '— (taken at execution)',
      steps: [
        { state: 'ok', label: 'Guardian: request triaged + plan prepared' },
        { state: 'ok', label: 'Guardian: pre-checks attached' },
        { state: 'pend', label: tier === 4 ? 'Site visit scheduled with you' : 'Engineer review (within 1 business hour)' },
        { state: 'pend', label: 'Execution + verification' },
      ],
      verify: ['Pending'],
      reversible: true,
      rkind: 'cancel',
    })
    return delay(rec)
  },

  async unblockFromDiagnosis(description) {
    const rec = addCr({
      tier: 2,
      badge: 'ai',
      title: 'Content-policy exception: site unblocked for staff VLAN',
      executor: 'AI Guardian',
      approved: 'You · just now',
      rationale: `Diagnosis showed the site was blocked by your own content policy, not broken (from: "${description}"). You chose an exception for the staff VLAN.`,
      snapshot: genSnap(),
      steps: [
        { state: 'ok', label: 'Snapshot config' },
        { state: 'ok', label: 'Added allow-list exception — staff VLAN only' },
        { state: 'ok', label: 'Verified: page loads from a staff device' },
      ],
      verify: ['Exception scoped to staff VLAN', 'Guest policy unchanged'],
      reversible: true,
      rkind: 'reblock',
    })
    return delay(rec)
  },

  async listPolicies() {
    return delay(policies.map((p) => ({ ...p })))
  },

  async togglePolicy(key) {
    const policy = policies.find((p) => p.key === key)
    if (!policy) throw new Error(`Unknown policy ${key}`)
    policy.on = !policy.on
    const name = POLICY_TOAST_NAME[key] ?? policy.label
    const pushSeconds = (Math.random() * 4 + 2).toFixed(1)
    addCr({
      tier: 2,
      badge: 'done',
      title: `${name} ${policy.on ? 'enabled' : 'disabled'}`,
      executor: 'You',
      approved: 'You · just now',
      rationale: 'Network policy toggled directly from Controls.',
      snapshot: genSnap(),
      steps: [{ state: 'ok', label: `${policy.on ? 'Enabled' : 'Disabled'} — pushed to firewall` }],
      verify: ['Policy change confirmed active on all VLANs'],
      reversible: true,
      rkind: 'snapshot',
    })
    return delay({ policy: { ...policy }, outcomeMessage: `${name} ${policy.on ? 'enabled' : 'disabled'} — pushed to firewall (${pushSeconds} s)` })
  },

  async listBlockedDomains() {
    return delay([...blockedDomains])
  },

  async blockDomain(domain) {
    const v = domain.trim().toLowerCase()
    if (!v) throw new Error('Enter a domain to block')
    blockedDomains = [v, ...blockedDomains]
    addCr({
      tier: 2,
      badge: 'done',
      title: `Blocked ${v}`,
      executor: 'You',
      approved: 'You · just now',
      rationale: 'Website blocked directly from Controls.',
      snapshot: genSnap(),
      steps: [{ state: 'ok', label: `Added ${v} to business-VLAN blocklist` }],
      verify: ['Blocklist active on all business VLANs'],
      reversible: true,
      rkind: 'snapshot',
    })
    return delay({ outcomeMessage: `${v} blocked network-wide — active in 8 s` })
  },

  async unblockDomain(domain) {
    blockedDomains = blockedDomains.filter((d) => d !== domain)
    addCr({
      tier: 2,
      badge: 'done',
      title: `Unblocked ${domain}`,
      executor: 'You',
      approved: 'You · just now',
      rationale: 'Website unblocked directly from Controls.',
      snapshot: genSnap(),
      steps: [{ state: 'ok', label: `Removed ${domain} from the blocklist` }],
      verify: ['Domain reachable again on business VLANs'],
      reversible: true,
      rkind: 'snapshot',
    })
    return delay({ outcomeMessage: `${domain} unblocked` })
  },

  async pauseDevice(mac, label) {
    const restoreAt = new Date(Date.now() + 3600e3).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false })
    addCr({
      tier: 2,
      badge: 'done',
      title: `Paused ${label}`,
      executor: 'You',
      approved: 'You · just now',
      rationale: `Device paused directly from Controls (${mac}).`,
      snapshot: genSnap(),
      steps: [{ state: 'ok', label: `Applied deny policy, time-boxed 1 h to ${label}` }],
      verify: [`Auto-restores at ${restoreAt}`],
      reversible: true,
      rkind: 'snapshot',
    })
    return delay({ outcomeMessage: `${label} paused for 1 h — internet access suspended, auto-restores at ${restoreAt}` })
  },

  async listChanges() {
    return delay(CR_STORE.map((r) => ({ ...r, steps: [...r.steps], verify: [...r.verify] })))
  },

  async reverseChange(num) {
    const rec = CR_STORE.find((r) => r.num === num)
    if (!rec || !rec.reversible) throw new Error(`Change #${num} is not reversible`)
    rec.reversible = false
    const kind: ReverseKind = rec.rkind ?? 'snapshot'
    const messages: Record<ReverseKind, [ChangeRecord['badge'], string]> = {
      snapshot: ['rev', `Restored snapshot #${(rec.snapshot || '').replace(' (taken at execution)', '')} — verified clean in 4 s`],
      cancel: ['can', 'Scheduled change cancelled — nothing was applied'],
      reblock: ['rev', 'Site re-blocked on the staff VLAN — policy exception removed'],
    }
    const [badge, msg] = messages[kind]
    rec.badge = badge
    rec.revNote = `Reversed by you just now — ${msg}.`
    rec.when += ' · reversed just now'
    addCr({
      tier: rec.tier,
      badge: 'ai',
      title: `Reversal of #CR-${rec.num} — ${rec.title}`,
      executor: 'AI Guardian',
      approved: 'You · just now',
      rationale: `You requested reversal of #CR-${rec.num}. Reversals restore the pre-change state and are verified like any other change.`,
      snapshot: kind === 'snapshot' ? `${rec.snapshot} (restored)` : '—',
      steps: [
        { state: 'ok', label: 'Located restore point / original state' },
        { state: 'ok', label: msg },
        { state: 'ok', label: 'Verified: state matches pre-change' },
      ],
      verify: ['Post-reversal check passed'],
      reversible: false,
      revNote: 'This entry is itself a reversal.',
    })
    return delay({ ...rec })
  },

  async logContainment(input) {
    const rec = addCr({
      tier: 1,
      badge: 'ai',
      title: input.title,
      executor: 'AI Guardian (autonomous containment)',
      approved: '— (Tier 1: containment)',
      rationale: input.rationale,
      snapshot: '— (containment: nothing to roll back)',
      steps: input.steps,
      verify: input.verify,
      reversible: false,
      revNote: 'Containment actions are lifted by the engineer after the physical check — not reversed from the portal.',
    })
    return delay(rec)
  },
}

/** Test-only: reseed mock state between test runs. */
export function resetMockControls() {
  crCounter = 118
  CR_STORE = SEED_CHANGES.map((r) => ({ ...r, steps: [...r.steps], verify: [...r.verify] }))
  policies = SEED_POLICIES.map((p) => ({ ...p }))
  blockedDomains = ['solitaire-online.gg', 'freefilesync-cloud.net']
}
