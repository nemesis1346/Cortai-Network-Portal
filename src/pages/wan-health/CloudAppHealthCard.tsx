import { useState } from 'react'
import type { CloudApp } from '@/api'

interface CloudAppHealthCardProps {
  apps: CloudApp[] | null
  liveLatencies: Record<string, number>
}

export function CloudAppHealthCard({ apps, liveLatencies }: CloudAppHealthCardProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="card">
      <h3>
        Cloud application health <span className="tagpill">MEASURED FROM YOUR FIREWALL · EVERY 30 S</span>
      </h3>
      {apps?.map((app) => {
        const open = openIds.has(app.id)
        const now = liveLatencies[app.id] ?? app.nowMs
        return (
          <div key={app.id} className={`apph-row${open ? ' open' : ''}`} onClick={() => toggle(app.id)}>
            <div className="apph-ic" style={{ background: `${app.color}26`, color: app.color }}>
              {app.abbreviation}
            </div>
            <div className="apph-main">
              <div className="apph-name">
                {app.name} <span className="tag">{app.tag}</span>
              </div>
              <div className="apph-meta">{app.meta}</div>
            </div>
            <span className={`xg ${app.verdict === 'excellent' ? 'ex' : 'dg'}`}>{app.verdictLabel}</span>
            <div className="apph-nums">
              <div className="n">
                <div className={`v mono-num${app.verdict === 'degraded' ? ' warn' : ''}`}>{now.toFixed(0)} ms</div>
                <div className="l">Now</div>
              </div>
              <div className="n">
                <div className="v mono-num">{app.baselineMs} ms</div>
                <div className="l">30d baseline</div>
              </div>
              <div className="n">
                <div className="v mono-num">{app.uptimePercent}%</div>
                <div className="l">Uptime · biz hrs</div>
              </div>
            </div>
            {app.pathBreakdown && (
              <div className="path" onClick={(e) => e.stopPropagation()}>
                {app.pathBreakdown.hops.map((hop, i) => (
                  <span key={hop.label} style={{ display: 'contents' }}>
                    {i > 0 && <span className="arr">→</span>}
                    <span className={`hop${hop.warn ? ' warn' : ''}`}>
                      {hop.warn ? '⚠' : <span className="okm">✓</span>} {hop.label}
                      {hop.latencyMs !== null && (
                        <b>
                          {' '}
                          {hop.incremental ? '+' : ''}
                          {hop.latencyMs} ms
                        </b>
                      )}
                    </span>
                  </span>
                ))}
              </div>
            )}
            {app.pathBreakdown && (
              <div
                className="apph-note"
                onClick={(e) => e.stopPropagation()}
                dangerouslySetInnerHTML={{ __html: app.pathBreakdown.conclusion_html }}
              />
            )}
            <span className="apph-chev">▶</span>
            <div className="apph-dev" onClick={(e) => e.stopPropagation()}>
              {app.devices.map((d) => (
                <div key={d.id} className="ad-row">
                  <span className={`ad-dot${d.active ? '' : ' idle'}`} />
                  <span className="ad-who">
                    <span className="a">
                      {d.label} <span>{d.detail}</span>
                    </span>
                    <span className="b">{d.status}</span>
                  </span>
                  <span className="ad-nums">
                    <span className="ad-num-col">
                      <span className="v">{d.time}</span>
                      <span className="l">Today</span>
                    </span>
                    <span className="ad-num-col">
                      <span className="v">{d.volume}</span>
                      <span className="l">Data</span>
                    </span>
                  </span>
                </div>
              ))}
              {app.deviceNote && <div className="ad-note">{app.deviceNote}</div>}
              {app.allowListNote && <div className="ad-note" dangerouslySetInnerHTML={{ __html: app.allowListNote }} />}
            </div>
          </div>
        )
      })}
      <div className="gov-note">
        <b>Why this matters:</b> when an app feels slow, the expensive question is "whose fault is it?" We measure
        every segment of the path — your LAN, our firewall, Bell, the internet, and the application itself — every
        30 seconds, so the answer is on this screen before anyone picks up a phone. Uptime is measured from{' '}
        <b>your</b> building during <b>your</b> business hours, not from the vendor's global status page, and drift
        from each app's 30-day baseline alerts us before your staff notice. Add or remove watched applications in
        Controls.
      </div>
    </div>
  )
}
