import type { GuardTier } from '@/api'

const TIERS: { t: GuardTier; tt: string; td: string }[] = [
  { t: 1, tt: 'TIER 1 · AI GUARDIAN', td: 'Autonomous — bounded, reversible, snapshot & auto-verify' },
  { t: 2, tt: 'TIER 2 · AI + YOUR OK', td: 'Business judgment is yours; Guardian executes on one tap' },
  { t: 3, tt: 'TIER 3 · ENGINEER', td: 'Attack surface / structural — Guardian preps, human applies' },
  { t: 4, tt: 'TIER 4 · HUMAN ONLY', td: 'Physical work, incidents, protected objects — never AI' },
]

export function TierRail({ activeTier }: { activeTier: GuardTier | null }) {
  return (
    <div className="trail">
      {TIERS.map(({ t, tt, td }) => (
        <div key={t} className={`tseg${activeTier === t ? ' hit' : ''}`} data-t={t}>
          <div className="tt">{tt}</div>
          <div className="td">{td}</div>
        </div>
      ))}
    </div>
  )
}
