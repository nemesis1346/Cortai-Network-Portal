import type { WanStatus } from '@/api'

interface WanStatusCardsProps {
  status: WanStatus | null
  primaryLatencyMs: number | null
}

export function WanStatusCards({ status, primaryLatencyMs }: WanStatusCardsProps) {
  const primary = status?.primary
  const backup = status?.backup
  const latency = primaryLatencyMs ?? primary?.latencyMs

  return (
    <div className="grid g3">
      <div className="card">
        <h3>
          Primary — Bell Fibe 1G <span className="tagpill">ACTIVE</span>
        </h3>
        <div className="kpi-inline">
          <div className="k">
            <div className="v mono-num">{latency !== undefined ? `${latency.toFixed(1)} ms` : '—'}</div>
            <div className="l">Latency</div>
          </div>
          <div className="k">
            <div className="v mono-num">{primary ? `${primary.jitterMs} ms` : '—'}</div>
            <div className="l">Jitter</div>
          </div>
          <div className="k">
            <div className="v mono-num">{primary ? `${primary.lossPercent.toFixed(2)}%` : '—'}</div>
            <div className="l">Loss</div>
          </div>
          <div className="k">
            <div className="v mono-num">{primary ? `${primary.downMbps} / ${primary.upMbps}` : '—'}</div>
            <div className="l">Mbps ↓/↑</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Backup — LTE failover</h3>
        <div className="kpi-inline">
          <div className="k">
            <div className="v mono-num">{backup ? `${backup.latencyMs} ms` : '—'}</div>
            <div className="l">Latency</div>
          </div>
          <div className="k">
            <div className="v" style={{ color: 'var(--ok)' }}>
              {backup?.state ?? '—'}
            </div>
            <div className="l">State</div>
          </div>
          <div className="k">
            <div className="v mono-num">{backup ? backup.activations90d : '—'}</div>
            <div className="l">Activations · 90d</div>
          </div>
          <div className="k">
            <div className="v mono-num">{backup ? `${backup.downtimeFeltSec} s` : '—'}</div>
            <div className="l">Downtime felt</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Uptime 90 days</h3>
        <div className="big green">{status ? `${status.uptime90dPercent}%` : '—'}</div>
        <div className="bigsub">vs 99.5% typical telco SLA — and they don't monitor it for you</div>
      </div>
    </div>
  )
}
