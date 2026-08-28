import type { SecurityKpis } from '@/api'
import { Alert, StatCard } from '@/components/ui-v2'
import { useCountUp } from '@/hooks/useCountUp'

interface SecurityKpiRowProps {
  kpis: SecurityKpis | null
  error: string | null
}

export function SecurityKpiRow({ kpis, error }: SecurityKpiRowProps) {
  const threats = useCountUp(kpis?.threats_blocked_30d ?? null)
  const intrusions = useCountUp(kpis?.intrusion_attempts ?? null)
  const malware = useCountUp(kpis?.malware_stopped ?? null)
  const phishing = useCountUp(kpis?.phishing_blocked ?? null)

  if (error) {
    return <Alert variant="danger" title="Security summary unavailable" description={error} />
  }

  return (
    <>
      <StatCard
        compact
        glow="danger"
        title="Threats blocked · 30d"
        value={<span className="c-danger">{kpis ? threats : '—'}</span>}
        label="automatically, zero action needed"
      />
      <StatCard compact title="Intrusion attempts" value={kpis ? intrusions : '—'} label="IPS signatures matched" />
      <StatCard compact title="Malware stopped" value={kpis ? malware : '—'} label="incl. 3 zero-day via sandbox" />
      <StatCard compact title="Phishing sites blocked" value={kpis ? phishing : '—'} label="before an employee could click" />
      <StatCard
        compact
        glow="success"
        title="Security grade"
        value={<span className="c-accent">{kpis?.grade ?? '—'}</span>}
        label="Fortinet Security Rating · top 8%"
      />
    </>
  )
}
