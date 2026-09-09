import { useEffect, useState } from 'react'
import { errorMessage, portalApi, type AttackOrigin } from '@/api'
import { Badge, Card, CardBody, CardHeader, CardTitle, Segmented, Unavailable } from '@/components/ui-v2'

const RANGE_OPTIONS = [
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
]

export function AttackOriginsCard() {
  const [origins, setOrigins] = useState<AttackOrigin[] | null>(null)
  const [originsReason, setOriginsReason] = useState<string | null>(null)
  const [range, setRange] = useState('7d')

  useEffect(() => {
    portalApi.security
      .getAttackOrigins()
      .then(setOrigins)
      .catch((err) => setOriginsReason(errorMessage(err)))
  }, [])

  const total = origins?.reduce((sum, o) => sum + o.count, 0) ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attack origins</CardTitle>
        {!originsReason && <Badge variant="neutral">Total {total.toLocaleString()}</Badge>}
        <span className="spacer" />
        <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </CardHeader>
      <CardBody>
        {originsReason ? (
          <Unavailable title="Attack origins unavailable" reason={originsReason} icon="globe" />
        ) : (
          <div className="origins">
            {origins?.map((origin) => {
              const percent = total ? Math.round((origin.count / total) * 100) : 0
              return (
                <div key={origin.country}>
                  <b>{origin.country}</b>
                  <span className="bar">
                    <span className="bar__fill" style={{ inlineSize: `${origin.bar_percent}%` }} />
                  </span>
                  <span className="num">
                    {origin.count} / {percent}%
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
