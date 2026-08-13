import type { ReportKpi } from '@/api'

interface ReportKpisProps {
  kpis: ReportKpi[]
}

export function ReportKpis({ kpis }: ReportKpisProps) {
  return (
    <div className="grid g5">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="card">
          <h3>{kpi.label}</h3>
          <div className={`big${kpi.colorClass ? ` ${kpi.colorClass}` : ''}`}>{kpi.value}</div>
          <div className="bigsub">{kpi.sub}</div>
        </div>
      ))}
    </div>
  )
}
