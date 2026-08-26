import { useEffect, useState } from 'react'
import { ACTIVITY_LABEL, homeApi, type ActivityEvent, type ActivityEventKind } from '@/api'
import { Badge, Card, CardBody, CardHeader, CardTitle } from '@/components/ui-v2'
import { formatEventTime } from './commandCenterDisplay'

const MAX_ROWS = 10

const KIND_BADGE_VARIANT: Record<ActivityEventKind, 'danger' | 'warning' | 'success'> = {
  blk: 'danger',
  qtn: 'warning',
  alw: 'success',
}

export function LiveActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([])

  useEffect(() => {
    return homeApi.subscribeActivity((event) => {
      setEvents((prev) => [event, ...prev].slice(0, MAX_ROWS))
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live activity</CardTitle>
        <span className="spacer" />
        <Badge variant="success" dot live>
          Live
        </Badge>
      </CardHeader>
      <CardBody>
        {events.length === 0 ? (
          <p className="t-body-sm c-tertiary">Watching for activity…</p>
        ) : (
          <div className="live">
            {events.map((event) => (
              <div key={event.id} className="live__row">
                <span className="live__time">{formatEventTime(event.at)}</span>
                <span className="live__text" dangerouslySetInnerHTML={{ __html: event.message_html }} />
                <span className="live__badge">
                  <Badge variant={KIND_BADGE_VARIANT[event.kind]} size="sm">
                    {ACTIVITY_LABEL[event.kind]}
                  </Badge>
                </span>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
