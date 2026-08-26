import { useState } from 'react'
import { Segmented } from '@/components/ui-v2'
import type { TrafficSpec } from '@/api'
import { buildSparkline } from './topologySparkline'

interface TrafficCardProps {
  traffic: TrafficSpec
}

const RANGE_OPTIONS = [
  { key: '60s', label: '60s' },
  { key: '24h', label: '24h' },
]

export function TrafficCard({ traffic }: TrafficCardProps) {
  const [range, setRange] = useState('60s')
  const { areaPath, linePath } = buildSparkline(traffic.seed, traffic.danger)
  const color = traffic.danger ? 'var(--color-status-danger)' : 'var(--color-chart-series-1)'
  const gradientId = `topo-traffic-${traffic.seed}`

  return (
    <section>
      <div className="section-head">
        <span className="section-title">Traffic{traffic.showRangeToggle ? '' : ' — last 60s'}</span>
        <span className="spacer" />
        {traffic.showRangeToggle && <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />}
      </div>
      <div className="card card--plain" style={{ padding: 'var(--spacing-16)', gap: 'var(--spacing-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
          <b className="t-h3 num">{traffic.value}</b>
          <span style={{ flex: 1 }} />
          <span className="badge badge--neutral badge--sm">throughput</span>
        </div>
        <svg viewBox="0 0 340 100" preserveAspectRatio="none" style={{ inlineSize: '100%', blockSize: 96 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} />
        </svg>
      </div>
    </section>
  )
}
