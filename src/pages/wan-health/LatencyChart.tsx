import { useState } from 'react'
import type { LatencySeries } from '@/api'
import { Card, CardBody, CardHeader, CardTitle, Segmented } from '@/components/ui-v2'

const W = 1000
const H = 220
const AXIS_LABELS = ['−24 h', '−18 h', '−12 h', '−6 h', 'now']
const GRID_FRACTIONS = [0, 0.25, 0.5, 0.75, 1]
const RANGE_OPTIONS = [
  { key: '24h', label: '24h' },
  { key: '1w', label: '1w' },
]

interface LatencyChartProps {
  series: LatencySeries | null
}

function yFor(ms: number, maxMs: number): number {
  return H - 4 - (ms / maxMs) * (H - 8)
}

/**
 * Declarative SVG rebuild of the mockup's drawWan() (imperative 2x-DPI canvas) —
 * same viewBox scale as the source's doubled-canvas convention (150px CSS
 * height x2 = 300), gridlines/threshold/spike styling matching v2's real
 * source, but scaled to this app's real dynamic LatencySeries (maxMs/
 * thresholdMs/spike indices) rather than v2's own hardcoded fixed 0-100 scale
 * — that fixed scale would clip this app's real spike, which reaches ~210ms.
 *
 * Labels render as HTML overlays, not SVG <text>: the chart uses
 * preserveAspectRatio="none" so it can stretch to fill its container, but
 * that non-uniform scale squashes SVG text into an illegible sliver at any
 * aspect ratio other than the design's own. Lines/fills are unaffected since
 * they're just point geometry, so only text moves out to HTML.
 */
export function LatencyChart({ series }: LatencyChartProps) {
  const [range, setRange] = useState('24h')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latency (Bell Fibe)</CardTitle>
        <span className="spacer" />
        <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </CardHeader>
      <CardBody fixed>{series && <LatencyChartBody series={series} />}</CardBody>
    </Card>
  )
}

function LatencyChartBody({ series }: { series: LatencySeries }) {
  const points = series.points.map((p) => ({
    x: (p.index / (series.points.length - 1)) * W,
    y: yFor(p.ms, series.maxMs),
  }))
  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(' ')
  const spikeX1 = (series.spikeStartIndex / series.points.length) * W
  const spikeX2 = (series.spikeEndIndex / series.points.length) * W
  const thresholdY = yFor(series.thresholdMs, series.maxMs)

  return (
    <div className="wanchart-container">
      <div className="wanchart-wrap">
        <div className="wanchart-axis">
          {GRID_FRACTIONS.map((frac) => (
            <span key={frac} style={{ top: `${(yFor(frac * series.maxMs, series.maxMs) / H) * 100}%` }}>
              {Math.round(frac * series.maxMs)}
            </span>
          ))}
        </div>

        <div className="wanchart-plot">
          <svg className="wanchart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="wanchart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-series-1)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-chart-series-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            {GRID_FRACTIONS.map((frac) => (
              <line
                key={frac}
                x1={0}
                y1={yFor(frac * series.maxMs, series.maxMs)}
                x2={W}
                y2={yFor(frac * series.maxMs, series.maxMs)}
                stroke="var(--color-grid-line)"
                strokeDasharray="3 5"
              />
            ))}
            <rect x={spikeX1} y={0} width={spikeX2 - spikeX1} height={H} fill="var(--color-status-danger)" opacity={0.12} />
            <polygon points={`${pointsStr} ${W},${H} 0,${H}`} fill="url(#wanchart-gradient)" />
            <polyline points={pointsStr} fill="none" stroke="var(--color-chart-series-1)" strokeWidth={1.5} />
            <line
              x1={0}
              y1={thresholdY}
              x2={W}
              y2={thresholdY}
              stroke="var(--color-status-warning)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.7}
            />
          </svg>

          <span
            className="wanchart-label threshold"
            style={{ left: `${(12 / W) * 100}%`, top: `${(thresholdY / H) * 100}%` }}
          >
            {series.thresholdMs} ms alert threshold
          </span>
          <span
            className="wanchart-label annotation"
            style={{ left: `${((spikeX1 + 10) / W) * 100}%`, top: `${(34 / H) * 100}%` }}
          >
            {series.annotation}
          </span>
        </div>
      </div>
      <div className="axis24">
        {AXIS_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}
