import type { HomeHealth } from '@/api'
import { useCountUp } from './useCountUp'

const RING_CIRCUMFERENCE = 402

interface HealthRingSectionProps {
  health: HomeHealth | null
  error: string | null
  onNavigate: (tab: string) => void
}

export function HealthRingSection({ health, error, onNavigate }: HealthRingSectionProps) {
  const score = useCountUp(health?.score ?? null, 1100)
  const offset = health ? RING_CIRCUMFERENCE * (1 - health.score / 100) : RING_CIRCUMFERENCE

  if (error) {
    return <div className="card degraded">Health status unavailable — {error}</div>
  }

  return (
    <div className="home-top">
      <div className="card ring-card">
        <div className="ring-wrap">
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle className="ring-bg" cx="75" cy="75" r="64" />
            <circle
              className="ring-fg"
              cx="75"
              cy="75"
              r="64"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="ring-num">
            <span className="n">{health ? score : '—'}</span>
            <span className="l">Health score</span>
          </div>
        </div>
        <div className="ring-status">● {health?.status ?? 'Loading…'}</div>
        <div className="ring-sub">{health?.contributors.join(' · ') ?? ''}</div>
      </div>
      <div className="sect-grid">
        {(health?.sections ?? []).map((section) => (
          <div key={section.key} className="card sect" onClick={() => onNavigate(section.tab)}>
            <h3>{section.label}</h3>
            <span className="open">Open →</span>
            <div className="hstat">{section.stat}</div>
            <div className="hsub">{section.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
