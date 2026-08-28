import type { WanStatus } from '@/api'
import { Badge, Card, CardHeader, Ring } from '@/components/ui-v2'

interface WanStatusCardsProps {
  status: WanStatus | null
  primaryLatencyMs: number | null
}

export function WanStatusCards({ status, primaryLatencyMs }: WanStatusCardsProps) {
  const primary = status?.primary
  const backup = status?.backup
  const latency = primaryLatencyMs ?? primary?.latencyMs

  return (
    <>
      <Card variant="plain" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--spacing-20)' }}>
        <span className="card__glow card__glow--success" />
        <Ring value={status?.uptime90dPercent ?? 0} size="md" variant="success" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <span className="stat-card__title">Uptime — 90 days</span>
          <span className="t-h1 c-accent num">{status ? `${status.uptime90dPercent}%` : '—'}</span>
          <span className="stat-card__label">vs 99.5% typical telco SLA</span>
        </div>
      </Card>

      <Card variant="plain">
        <CardHeader>
          <h2 className="stat-card__title">Primary — Bell Fibe 1G</h2>
          <span className="spacer" />
          <Badge variant="success" size="sm">
            ACTIVE
          </Badge>
        </CardHeader>
        <div className="grid-4 metric-row">
          <div>
            <p className="t-h2 c-primary num">{latency !== undefined ? `${latency.toFixed(1)} ms` : '—'}</p>
            <p className="stat-card__label">Latency</p>
          </div>
          <div>
            <p className="t-h2 c-primary num">{primary ? `${primary.jitterMs} ms` : '—'}</p>
            <p className="stat-card__label">Jitter</p>
          </div>
          <div>
            <p className="t-h2 c-primary num">{primary ? `${primary.lossPercent.toFixed(2)}%` : '—'}</p>
            <p className="stat-card__label">Loss</p>
          </div>
          <div>
            <p className="t-h2 c-primary num">{primary ? `${primary.downMbps} / ${primary.upMbps}` : '—'}</p>
            <p className="stat-card__label">Mbps ↓/↑</p>
          </div>
        </div>
      </Card>

      <Card variant="plain">
        <CardHeader>
          <h2 className="stat-card__title">Backup — LTE failover</h2>
        </CardHeader>
        <div className="grid-4 metric-row">
          <div>
            <p className="t-h2 c-primary num">{backup ? `${backup.latencyMs} ms` : '—'}</p>
            <p className="stat-card__label">Latency</p>
          </div>
          <div>
            <p className="t-h2 c-primary">{backup?.state ?? '—'}</p>
            <p className="stat-card__label">State</p>
          </div>
          <div>
            <p className="t-h2 c-primary num">{backup ? backup.activations90d : '—'}</p>
            <p className="stat-card__label">Activations · 90d</p>
          </div>
          <div>
            <p className="t-h2 c-primary num">{backup ? `${backup.downtimeFeltSec} s` : '—'}</p>
            <p className="stat-card__label">Downtime felt</p>
          </div>
        </div>
      </Card>
    </>
  )
}
