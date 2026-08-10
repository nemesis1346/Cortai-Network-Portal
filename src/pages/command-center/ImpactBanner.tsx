import type { HomeKpis } from '@/api'
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
    return <div className="card degraded">Impact summary unavailable — {error}</div>
  }

  return (
    <div className="grid g4">
      <div className="card imp">
        <h3>Attacks stopped today</h3>
        <div className="big red">{kpis ? attacks : '—'}</div>
        <div className="bigsub">none reached a device or inbox</div>
      </div>
      <div className="card imp">
        <h3>Downtime your business felt</h3>
        <div className="big green">{kpis ? `${kpis.downtime_min} min` : '—'}</div>
        <div className="bigsub">POS, door access, cameras &amp; Wi-Fi stayed up</div>
      </div>
      <div className="card imp">
        <h3>Systems under protection</h3>
        <div className="big">{kpis ? devicesProtected : '—'}</div>
        <div className="bigsub">every device monitored, patched &amp; baselined</div>
      </div>
      <div className="card imp">
        <h3>Self-healed this month</h3>
        <div className="big violet">{kpis ? selfHealed : '—'}</div>
        <div className="bigsub">issues fixed by the Guardian before anyone noticed</div>
      </div>
    </div>
  )
}
