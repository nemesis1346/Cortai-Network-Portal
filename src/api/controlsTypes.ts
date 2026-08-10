export type GuardTier = 1 | 2 | 3 | 4

export type TriageReason = 'tier4-regex' | 'tier3-regex' | 'intent' | 'fallback'

export interface TriageIntent {
  id: string
  what: string
  plan: string[]
  secs: number
  isPasswordRotation: boolean
  isDiagnostic: boolean
  primaryButtonLabel: string
}

export interface TriageResult {
  reason: TriageReason
  tier: GuardTier
  tier_label: string
  tier_message_html: string
  /** Only set when reason === 'fallback' — a genuine no-match, not a deliberate Tier 3/4 keyword hit. */
  fallback_note: string | null
  intent: TriageIntent | null
  /** Illustrative (0-1) — the real backend will be an LLM's actual confidence. */
  confidence: number
  requires_approval: boolean
  description: string
}

export type ChangeBadge = 'ai' | 'sched' | 'sub' | 'done' | 'rev' | 'blk' | 'can'
export type ReverseKind = 'snapshot' | 'cancel' | 'reblock'

export interface ChangeStep {
  state: 'ok' | 'warn' | 'pend'
  label: string
}

export interface ChangeRecord {
  num: number
  tier: GuardTier
  badge: ChangeBadge
  title: string
  when: string
  executor: string
  approved: string
  rationale: string
  snapshot: string
  steps: ChangeStep[]
  verify: string[]
  reversible: boolean
  rkind?: ReverseKind
  revNote?: string | null
  diagnosis?: {
    verdict: string
    tone: 'ok' | 'ask' | 'esc'
    message: string
    askActions?: boolean
  }
  passwordReveal?: {
    passphrase: string
  }
}

export interface PolicyToggle {
  key: string
  label: string
  detail: string
  on: boolean
}

export interface ControlsApi {
  triage(description: string): Promise<TriageResult>
  runChange(triage: TriageResult): Promise<ChangeRecord>
  scheduleChange(triage: TriageResult): Promise<ChangeRecord>
  submitToEngineer(triage: TriageResult): Promise<ChangeRecord>
  unblockFromDiagnosis(description: string): Promise<ChangeRecord>

  listPolicies(): Promise<PolicyToggle[]>
  togglePolicy(key: string): Promise<{ policy: PolicyToggle; outcomeMessage: string }>

  listBlockedDomains(): Promise<string[]>
  blockDomain(domain: string): Promise<{ outcomeMessage: string }>
  unblockDomain(domain: string): Promise<{ outcomeMessage: string }>

  pauseDevice(mac: string, label: string): Promise<{ outcomeMessage: string }>

  listChanges(): Promise<ChangeRecord[]>
  reverseChange(num: number): Promise<ChangeRecord>

  /**
   * Generic autonomous-containment journal entry — used by modules other than
   * Controls itself (e.g. Security's attack simulation) that need to log into the
   * same change journal without going through the Guardian triage flow.
   */
  logContainment(input: { title: string; rationale: string; steps: ChangeStep[]; verify: string[] }): Promise<ChangeRecord>
}

export const TIER_LABEL: Record<GuardTier, string> = {
  1: 'TIER 1 · AI GUARDIAN',
  2: 'TIER 2 · AI + YOUR OK',
  3: 'TIER 3 · ENGINEER',
  4: 'TIER 4 · HUMAN ONLY',
}

export const CHANGE_BADGE_LABEL: Record<ChangeBadge, string> = {
  ai: 'AI GUARDIAN',
  sched: 'SCHEDULED',
  sub: 'SUBMITTED',
  done: 'COMPLETED',
  rev: 'ROLLED BACK',
  blk: 'BLOCKED',
  can: 'CANCELLED',
}
