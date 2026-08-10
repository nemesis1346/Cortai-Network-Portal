import { useEffect, useState } from 'react'
import { securityApi, type LateralEvent } from '@/api'
import { lateralSeverityColor } from './securityDisplay'

export function LateralEventsCard() {
  const [events, setEvents] = useState<LateralEvent[] | null>(null)

  useEffect(() => {
    securityApi.listLateralEvents().then(setEvents)
  }, [])

  return (
    <div className="card">
      <h3>Lateral events · 7 days</h3>
      {events?.map((event) => (
        <div key={event.id} className="ew-ev">
          <div className="sev" style={{ background: lateralSeverityColor(event.severity) }} />
          <div className="m">
            <span dangerouslySetInnerHTML={{ __html: event.message_html }} /> ·{' '}
            <span dangerouslySetInnerHTML={{ __html: event.action_html }} />
          </div>
        </div>
      ))}
      <div className="gov-note">
        <b>Reading this:</b> red cells are your segmentation earning its keep — every ✕ is a path an attacker (or a
        chatty gadget) tried and didn&apos;t get. A breach that lands on one device stays on one device. If a red
        count spikes or a new path opens that you didn&apos;t request, the Guardian isolates first and asks
        questions second.
      </div>
    </div>
  )
}
