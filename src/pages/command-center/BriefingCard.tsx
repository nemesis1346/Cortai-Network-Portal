import type { Briefing } from '@/api'
import { formatBriefTime } from './commandCenterDisplay'
import { useTypewriter } from './useTypewriter'

interface BriefingCardProps {
  briefing: Briefing | null
  error: string | null
  onNavigate: (tab: string) => void
}

export function BriefingCard({ briefing, error, onNavigate }: BriefingCardProps) {
  const { renderedHtml, done } = useTypewriter(briefing?.narrative_html ?? null)

  return (
    <div className="brief">
      <div className="brief-head">
        <div className="glyph">◈</div>
        <div className="brief-title">COrtai Briefing</div>
        <div className="brief-time">{briefing ? formatBriefTime(briefing.generated_at) : ''}</div>
      </div>
      {error ? (
        <div className="brief-text degraded">Briefing unavailable right now — {error}</div>
      ) : briefing ? (
        <>
          <div className="brief-text" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          <div className={`brief-chips${done ? ' show' : ''}`}>
            {briefing.chips.map((chip) => (
              <button key={chip.label} className="btn" onClick={() => onNavigate(chip.tab)}>
                {chip.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="brief-text">Loading briefing…</div>
      )}
    </div>
  )
}
