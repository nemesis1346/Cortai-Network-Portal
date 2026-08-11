import type { TopDestination } from '@/api'

interface TopDestinationsCardProps {
  destinations: TopDestination[] | null
  scopeLabel: string | null
}

export function TopDestinationsCard({ destinations, scopeLabel }: TopDestinationsCardProps) {
  return (
    <div className="card">
      <h3>
        Top destinations · 30d <span className="tagpill">{scopeLabel ?? '—'}</span>
      </h3>
      {destinations?.map((d) => (
        <div key={d.domain} className="site-row">
          <div className="site-ic" style={{ background: `${d.color}1f`, color: d.color }}>
            {d.abbreviation}
          </div>
          <div className="site-main">
            <div className="site-name">
              {d.domain}
              {d.flag && <span className="flag">{d.flag}</span>}
            </div>
            <div className="site-cat">{d.category}</div>
            <div className="site-bar">
              <i style={{ width: `${d.percent}%`, background: d.color }} />
            </div>
          </div>
          <div className="site-val">
            <div className="mono-num">{d.gb} GB</div>
            <div className="text-3">
              {d.percent}% · {d.deviceCountOrPeak}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
