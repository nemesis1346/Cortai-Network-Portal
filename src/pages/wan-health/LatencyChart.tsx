import type { LatencySeries } from '@/api'

const W = 1000
const H = 300
const AXIS_LABELS = ['−24 h', '−18 h', '−12 h', '−6 h', 'now']

interface LatencyChartProps {
  series: LatencySeries | null
}

function yFor(ms: number, maxMs: number): number {
  return H - 8 - (ms / maxMs) * (H - 20)
}

/**
 * Declarative SVG rebuild of the mockup's drawWan() (imperative 2x-DPI canvas) —
 * same geometry/colors/positions, same viewBox scale as the source's doubled-canvas
 * convention (150px CSS height x2 = 300), just no canvas ref/resize-redraw plumbing.
 *
 * Labels render as HTML overlays, not SVG <text>: the chart uses preserveAspectRatio="none"
 * so it can stretch to fill its container, but that non-uniform scale (~1.5x horizontal,
 * 0.5x vertical) squashes SVG text into an illegible sliver. Lines/fills are unaffected
 * since they're just point geometry, so only the two text labels move out to HTML.
 */
export function LatencyChart({ series }: LatencyChartProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <h3>Latency — last 24 h (Bell Fibe)</h3>
      {series && <LatencyChartBody series={series} />}
    </div>
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
    <>
      <div className="wanchart-wrap">
        <svg className="wanchart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <rect x={spikeX1} y={0} width={spikeX2 - spikeX1} height={H} fill="rgba(240,86,74,.08)" />
          <polygon points={`${pointsStr} ${W},${H} 0,${H}`} fill="rgba(45,212,167,.07)" />
          <polyline points={pointsStr} fill="none" stroke="#2dd4a7" strokeWidth={2} />
          <line
            x1={0}
            y1={thresholdY}
            x2={W}
            y2={thresholdY}
            stroke="rgba(224,164,88,.4)"
            strokeWidth={1.5}
            strokeDasharray="6,5"
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
      <div className="axis24">
        {AXIS_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </>
  )
}
