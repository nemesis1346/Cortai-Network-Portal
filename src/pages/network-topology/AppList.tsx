import { useState } from 'react'
import { Segmented } from '@/components/ui-v2'
import type { AppUsageRow } from '@/api'

const RANGE_OPTIONS = [
  { key: '24h', label: '24h' },
  { key: '30d', label: '30d' },
]

export function AppList({ rows }: { rows: AppUsageRow[] }) {
  const [range, setRange] = useState('24h')
  return (
    <section>
      <div className="section-head">
        <span className="section-title">Top 5 applications</span>
        <span className="spacer" />
        <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </div>
      <div className="apps">
        {rows.map((row) => (
          <div key={row.name} className="app-row">
            <b>{row.name}</b>
            <b className="num">{row.volume}</b>
            <span>{row.category}</span>
            <span className="num">{row.percent}%</span>
            <span className="bar">
              <span className="bar__fill" style={{ inlineSize: `${row.percent}%` }} />
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
