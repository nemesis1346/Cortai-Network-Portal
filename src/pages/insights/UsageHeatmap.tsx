import { Fragment } from 'react'
import type { HeatmapCell } from '@/api'

const DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOUR_LABELS = Array.from({ length: 24 }, (_, h) => (h % 6 === 0 ? String(h) : ''))
const LEGEND_ALPHAS = [0.06, 0.25, 0.55, 0.95]

interface UsageHeatmapProps {
  cells: HeatmapCell[] | null
}

export function UsageHeatmap({ cells }: UsageHeatmapProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <h3>Activity by time of day · last 4 weeks</h3>
      {cells && (
        <>
          <div className="hm">
            <span />
            {HOUR_LABELS.map((label, h) => (
              <span key={h} className="lab h">
                {label}
              </span>
            ))}
            {DAYS_ORDER.map((day) => (
              <Fragment key={day}>
                <span className="lab">{day}</span>
                {cells
                  .filter((c) => c.day === day)
                  .sort((a, b) => a.hour - b.hour)
                  .map((c) => (
                    <span
                      key={c.hour}
                      className="hm-c"
                      style={{ background: `rgba(45,212,167,${c.intensity})` }}
                      title={c.tooltip}
                    />
                  ))}
              </Fragment>
            ))}
          </div>
          <div className="hm-leg">
            Quiet
            {LEGEND_ALPHAS.map((alpha) => (
              <span key={alpha} className="sq" style={{ background: `rgba(45,212,167,${alpha})` }} />
            ))}
            Busy
          </div>
        </>
      )}
    </div>
  )
}
