import type { SecurityKpis } from '@/api'
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
    return <div className="card degraded">Security summary unavailable — {error}</div>
  }

  return (
    <div className="grid g5">
      <div className="card">
        <h3>Threats blocked · 30d</h3>
        <div className="big red">{kpis ? threats : '—'}</div>
        <div className="bigsub">automatically, zero action needed</div>
      </div>
      <div className="card">
        <h3>Intrusion attempts</h3>
        <div className="big">{kpis ? intrusions : '—'}</div>
        <div className="bigsub">IPS signatures matched</div>
      </div>
      <div className="card">
        <h3>Malware stopped</h3>
        <div className="big amber">{kpis ? malware : '—'}</div>
        <div className="bigsub">incl. 3 zero-day via sandbox</div>
      </div>
      <div className="card">
        <h3>Phishing sites blocked</h3>
        <div className="big violet">{kpis ? phishing : '—'}</div>
        <div className="bigsub">before an employee could click</div>
      </div>
      <div className="card">
        <h3>Security grade</h3>
        <div className="big green">{kpis?.grade ?? '—'}</div>
        <div className="bigsub">Fortinet Security Rating · top 8%</div>
      </div>
    </div>
  )
}
