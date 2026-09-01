import { Fragment } from 'react'
import type { HeatmapCell } from '@/api'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui-v2'

const DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOUR_LABELS = Array.from({ length: 24 }, (_, h) => (h % 6 === 0 ? String(h) : ''))
const LEGEND_OPACITIES = [0.1, 0.22, 0.38, 0.58, 0.8, 1]

interface UsageHeatmapProps {
  cells: HeatmapCell[] | null
}

export function UsageHeatmap({ cells }: UsageHeatmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity by time of day · last 4 weeks</CardTitle>
      </CardHeader>
      <CardBody>
        {cells && (
          <>
            <div className="heatmap">
              <span />
              {HOUR_LABELS.map((label, h) => (
                <span key={h} className="heatmap__hour">
                  {label}
                </span>
              ))}
              {DAYS_ORDER.map((day) => (
                <Fragment key={day}>
                  <span className="heatmap__day">{day}</span>
                  {cells
                    .filter((c) => c.day === day)
                    .sort((a, b) => a.hour - b.hour)
                    .map((c) => (
                      <span key={c.hour} className="heatmap__cell" style={{ opacity: c.intensity }} title={c.tooltip} />
                    ))}
                </Fragment>
              ))}
            </div>
            <div className="heatmap__scale">
              Quiet
              {LEGEND_OPACITIES.map((opacity) => (
                <i key={opacity} style={{ opacity }} />
              ))}
              Busy
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}
