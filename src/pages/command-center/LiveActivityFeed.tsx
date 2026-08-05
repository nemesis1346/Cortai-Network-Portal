import { useEffect, useState } from 'react'
import { ACTIVITY_LABEL, homeApi, type ActivityEvent } from '@/api'
import { formatEventTime } from './commandCenterDisplay'

const MAX_ROWS = 10

export function LiveActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([])

  useEffect(() => {
    return homeApi.subscribeActivity((event) => {
      setEvents((prev) => [event, ...prev].slice(0, MAX_ROWS))
    })
  }, [])

  return (
    <div className="card">
      <h3>
        Live activity <span className="tagpill">LIVE</span>
      </h3>
      <div className="feed">
        {events.length === 0 ? (
          <div className="text-3">Watching for activity…</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="feed-row">
              <span className="feed-t mono-num">{formatEventTime(event.at)}</span>
              <span className={`feed-b ${event.kind}`}>{ACTIVITY_LABEL[event.kind]}</span>
              <span className="feed-msg" dangerouslySetInnerHTML={{ __html: event.message_html }} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
