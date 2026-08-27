import type { GuardTier } from '@/api'

const TIERS: { t: GuardTier; title: string; desc: string }[] = [
  { t: 1, title: 'Tier 1 · AI Guardian', desc: 'Autonomous — bounded, reversible, snapshot & auto-verify' },
  { t: 2, title: 'Tier 2 · AI + your OK', desc: 'Business judgment is yours; Guardian executes on one tap' },
  { t: 3, title: 'Tier 3 · Engineer', desc: 'Attack surface / structural — Guardian preps, human applies' },
  { t: 4, title: 'Tier 4 · Human only', desc: 'Physical work, incidents, protected objects — never AI' },
]

export function TierRail({ activeTier }: { activeTier: GuardTier | null }) {
  return (
    <div className="grid-4 tier-row">
      {TIERS.map(({ t, title, desc }) => (
        <button key={t} type="button" className={`tier tier--${t}`} aria-current={activeTier === t ? 'true' : undefined}>
          <b>{title}</b>
          <p>{desc}</p>
        </button>
      ))}
    </div>
  )
}
