import { Fragment, useEffect, useState } from 'react'
import { securityApi, type EastWestMatrix } from '@/api'
import { matrixCellVisual } from './securityDisplay'

export function EastWestMatrixCard() {
  const [matrix, setMatrix] = useState<EastWestMatrix | null>(null)

  useEffect(() => {
    securityApi.getEastWestMatrix().then(setMatrix)
  }, [])

  return (
    <div className="card">
      <h3>
        East-west traffic — lateral movement watch <span className="tagpill">INSIDE THE WALLS</span>
      </h3>
      <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 10 }}>
        Firewalls watch the border. Breaches spread <b style={{ color: 'var(--text)' }}>sideways</b> — device to
        device, segment to segment. This matrix is every internal path in your network: rows are where traffic
        starts, columns where it tries to go.
      </p>
      {matrix && (
        <>
          <div className="ewm">
            <span />
            {matrix.segments.map((seg) => (
              <span key={seg} className="lb top">
                {seg}
              </span>
            ))}
            {matrix.rows.map((row, i) => (
              <Fragment key={matrix.segments[i]}>
                <span className="lb">{matrix.segments[i]}</span>
                {row.map((c, j) => {
                  const visual = matrixCellVisual(c.state)
                  return (
                    <div
                      key={`${matrix.segments[i]}-${matrix.segments[j]}`}
                      className={`ewc ${c.state}`}
                      title={c.tooltip}
                      style={{ background: visual.bg, borderColor: visual.border }}
                    >
                      <span className="v" style={{ color: visual.valueColor }}>
                        {c.value}
                      </span>
                      <span className="s">{c.label}</span>
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
          <div className="ew-leg">
            <span className="k">
              <span className="sq" style={{ background: 'rgba(45,212,167,.09)', borderColor: 'rgba(45,212,167,.3)' }} />
              Allowed by policy
            </span>
            <span className="k">
              <span className="sq" style={{ background: 'rgba(240,86,74,.09)', borderColor: 'rgba(240,86,74,.35)' }} />
              Attempts blocked
            </span>
            <span className="k">
              <span className="sq" style={{ background: 'var(--panel-2)' }} />
              Isolated — no path exists
            </span>
            <span className="k">
              <span className="sq" style={{ borderStyle: 'dashed' }} />
              Within own segment
            </span>
          </div>
        </>
      )}
    </div>
  )
}
