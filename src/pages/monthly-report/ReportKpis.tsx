import type { ReportKpi } from '@/api'
import { StatCard } from '@/components/ui-v2'

interface ReportKpisProps {
  kpis: ReportKpi[]
}

const GLOW: Record<NonNullable<ReportKpi['colorClass']>, 'success' | 'danger'> = {
  green: 'success',
  red: 'danger',
}

const VALUE_CLASS: Record<NonNullable<ReportKpi['colorClass']>, string> = {
  green: 'c-accent',
  red: 'c-danger',
}

export function ReportKpis({ kpis }: ReportKpisProps) {
  return (
    <>
      {kpis.map((kpi) => (
        <StatCard
          key={kpi.label}
          compact
          glow={kpi.colorClass ? GLOW[kpi.colorClass] : undefined}
          title={kpi.label}
          value={kpi.colorClass ? <span className={VALUE_CLASS[kpi.colorClass]}>{kpi.value}</span> : kpi.value}
          label={kpi.sub}
        />
      ))}
    </>
  )
}
