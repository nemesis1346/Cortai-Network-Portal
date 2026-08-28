import { useEffect, useState } from 'react'
import { securityApi, type EastWestMatrix, type EastWestState } from '@/api'
import { Alert, Card, CardBody, CardFooter, CardHeader, CardTitle, Icon, IconBadge, IconButton, Modal } from '@/components/ui-v2'

const CELL_MODIFIER: Record<EastWestState, string> = {
  ok: ' matrix__cell--allowed',
  blkd: ' matrix__cell--blocked',
  self: ' matrix__cell--self',
  iso: '',
}

export function EastWestMatrixCard() {
  const [matrix, setMatrix] = useState<EastWestMatrix | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    securityApi.getEastWestMatrix().then(setMatrix)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>East-west traffic — lateral movement watch</CardTitle>
        <span className="spacer" />
        <span className="badge badge--neutral">Inside the walls</span>
        <IconButton variant="ghost" size="xs" aria-label="What this is" onClick={() => setInfoOpen(true)}>
          <Icon name="info" />
        </IconButton>
      </CardHeader>
      <CardBody>
        {matrix && (
          <div className="matrix">
            <div className="matrix__head">
              <span />
              {matrix.segments.map((seg) => (
                <span key={seg} className="matrix__col">
                  {seg}
                </span>
              ))}
            </div>
            {matrix.rows.map((row, i) => (
              <div key={matrix.segments[i]} className="matrix__row">
                <span className="matrix__rowhead">{matrix.segments[i]}</span>
                {row.map((c, j) => (
                  <div key={`${matrix.segments[i]}-${matrix.segments[j]}`} className={`matrix__cell${CELL_MODIFIER[c.state]}`} title={c.tooltip}>
                    <b>{c.value}</b>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </CardBody>
      <CardFooter>
        <div className="matrix__legend">
          <span>
            <i className="matrix__swatch matrix__swatch--allowed" />
            Allowed by policy
          </span>
          <span>
            <i className="matrix__swatch matrix__swatch--blocked" />
            Attempts blocked
          </span>
          <span>
            <i className="matrix__swatch" />
            Isolated — no path exists
          </span>
          <span>
            <i className="matrix__swatch" style={{ borderStyle: 'dashed' }} />
            Within own segment
          </span>
        </div>
      </CardFooter>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} size="xs" label="East-west traffic" bare>
        <Alert
          variant="info"
          icon={
            <IconBadge variant="blue">
              <Icon name="shield" />
            </IconBadge>
          }
          title="East-west traffic"
          description="Movement between segments inside your network. Green cells are allowed by policy, red cells are attempts that were blocked, empty cells mean no path exists at all."
        />
      </Modal>
    </Card>
  )
}
