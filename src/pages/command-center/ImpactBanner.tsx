import type { HomeKpis } from '@/api'
import { Alert, StatCard } from '@/components/ui-v2'
import { useCountUp } from '@/hooks/useCountUp'

interface ImpactBannerProps {
  kpis: HomeKpis | null
  error: string | null
}

export function ImpactBanner({ kpis, error }: ImpactBannerProps) {
  const attacks = useCountUp(kpis?.attacks ?? null)
  const devicesProtected = useCountUp(kpis?.devices_protected ?? null)
  const selfHealed = useCountUp(kpis?.self_healed ?? null)

  if (error) {
    return <Alert variant="danger" title="Impact summary unavailable" description={error} />
  }

  return (
    <div className="grid-2" style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
      <StatCard
        glow="danger"
        title="Attacks stopped today"
        value={kpis ? attacks : '—'}
        trend={kpis?.attacks_trend}
        label="none reached a device or inbox"
      />
      <StatCard
        glow="success"
        title="Downtime your business felt"
        value={kpis ? `${kpis.downtime_min} min` : '—'}
        trend={kpis?.downtime_trend}
        label="POS, door access, cameras & Wi-Fi stayed up"
      />
      <StatCard
        glow="info"
        title="Systems under protection"
        value={kpis ? devicesProtected : '—'}
        label="every device monitored, patched & baselined"
      />
      <StatCard
        glow="danger"
        title="Self-healed this month"
        value={kpis ? selfHealed : '—'}
        trend={kpis?.self_healed_trend}
        label="issues fixed by the Guardian before anyone noticed"
      />
    </div>
  )
}
