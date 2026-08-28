import { useState } from 'react'
import type { CloudApp } from '@/api'
import { Badge, Card, CardBody, CardHeader, CardTitle, Segmented } from '@/components/ui-v2'
import { AppDeviceRow } from './AppDeviceRow'
import { WhoIsUsingItModal } from './WhoIsUsingItModal'

interface CloudAppHealthCardProps {
  apps: CloudApp[] | null
  liveLatencies: Record<string, number>
}

const RANGE_OPTIONS = [
  { key: '7d', label: '7d' },
  { key: '1m', label: '1m' },
]

const GRID_TEMPLATE = '530fr 180fr 110fr 110fr 120fr'

export function CloudAppHealthCard({ apps, liveLatencies }: CloudAppHealthCardProps) {
  const [range, setRange] = useState('7d')
  const [selectedApp, setSelectedApp] = useState<CloudApp | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud application health</CardTitle>
        <span className="spacer" />
        <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </CardHeader>
      <CardBody fixed style={{ display: 'flex' }}>
        <div className="table table--bare" style={{ flex: '1 1 auto' }}>
          <div className="table__head" style={{ gridTemplateColumns: GRID_TEMPLATE }}>
            <div className="th">Name</div>
            <div className="th">Using</div>
            <div className="th th--right">Now</div>
            <div className="th th--right">30d baseline</div>
            <div className="th th--right">Uptime · biz hrs</div>
          </div>

          <div className="table__body v2-scrollbars">
            {apps?.map((app) => {
              const now = liveLatencies[app.id] ?? app.nowMs
              const degraded = app.verdict === 'degraded'

              if (app.pathBreakdown) {
                return (
                  <div key={app.id}>
                    <div className="tr" aria-selected="true" style={{ gridTemplateColumns: GRID_TEMPLATE }}>
                      <span className="td">
                        <span className="td__device">
                          <b>
                            {app.name} <span className="c-tertiary">· {app.tag}</span>
                          </b>
                          <span>{app.meta}</span>
                        </span>
                      </span>
                      <span className="td">
                        <Badge variant="warning" size="sm">
                          {app.verdictLabel}
                        </Badge>
                      </span>
                      <span className="td td--right td--metric c-warning">{now.toFixed(0)} ms</span>
                      <span className="td td--right td--metric">{app.baselineMs} ms</span>
                      <span className="td td--right td--metric">{app.uptimePercent}%</span>
                    </div>
                    <div style={{ padding: 'var(--spacing-12) var(--spacing-20)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
                        {app.pathBreakdown.hops.map((hop, i) => (
                          <span key={hop.label} style={{ display: 'contents' }}>
                            {i > 0 && <span className="c-tertiary">→</span>}
                            <Badge variant={hop.warn ? 'warning' : 'neutral'} size="sm">
                              {hop.warn ? '⚠' : '✓'} {hop.label}
                              {hop.latencyMs !== null && ` · ${hop.incremental ? '+' : ''}${hop.latencyMs} ms`}
                            </Badge>
                          </span>
                        ))}
                      </div>
                      <div className="card card--plain" style={{ gap: 'var(--spacing-8)', padding: 'var(--spacing-12)' }}>
                        {app.devices.map((device) => (
                          <AppDeviceRow key={device.id} device={device} />
                        ))}
                      </div>
                      {app.pathBreakdown.conclusion_html && (
                        <p className="t-body-sm c-tertiary" dangerouslySetInnerHTML={{ __html: app.pathBreakdown.conclusion_html }} />
                      )}
                    </div>
                  </div>
                )
              }

              return (
                <button
                  key={app.id}
                  type="button"
                  className="tr"
                  style={{ gridTemplateColumns: GRID_TEMPLATE }}
                  onClick={() => setSelectedApp(app)}
                >
                  <span className="td">
                    <span className="td__device">
                      <b>
                        {app.name} <span className="c-tertiary">· {app.tag}</span>
                      </b>
                      <span>{app.meta}</span>
                    </span>
                  </span>
                  <span className="td">
                    <Badge variant="success" size="sm">
                      {app.verdictLabel}
                    </Badge>
                  </span>
                  <span className={`td td--right td--metric${degraded ? ' c-warning' : ''}`}>{now.toFixed(0)} ms</span>
                  <span className="td td--right td--metric">{app.baselineMs} ms</span>
                  <span className="td td--right td--metric">{app.uptimePercent}%</span>
                </button>
              )
            })}
          </div>
        </div>
      </CardBody>

      <WhoIsUsingItModal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </Card>
  )
}
