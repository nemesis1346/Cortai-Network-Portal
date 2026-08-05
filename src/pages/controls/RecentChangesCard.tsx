import type { ChangeRecord } from '@/api'
import { badgeVisual, tierTagVisual } from './controlsDisplay'

interface RecentChangesCardProps {
  changes: ChangeRecord[] | null
  onOpen: (num: number) => void
}

export function RecentChangesCard({ changes, onOpen }: RecentChangesCardProps) {
  return (
    <div className="card">
      <h3>
        Recent changes <span className="tagpill">CLICK ANY ENTRY FOR DETAIL + REVERSE</span>
      </h3>
      <div>
        {!changes ? (
          <div className="text-3">Loading…</div>
        ) : (
          changes.map((rec) => {
            const badge = badgeVisual(rec.badge)
            const tierTag = tierTagVisual(rec.tier)
            return (
              <div key={rec.num} className="cr-row" onClick={() => onOpen(rec.num)}>
                <span className="tch" style={{ color: tierTag.color, background: tierTag.bg }}>
                  {tierTag.label}
                </span>
                <span className="st2" style={{ color: badge.color, background: badge.bg }}>
                  {badge.label}
                </span>
                <span className="m">
                  <b>{rec.title}</b> · {rec.when} · #CR-{rec.num}
                </span>
              </div>
            )
          })
        )}
      </div>
      <div className="gov-note">
        <b>How changes work:</b> a snapshot is taken before anything is touched, the result is verified after, and
        failed verification rolls back automatically — at every tier, human or AI.
      </div>
    </div>
  )
}
