import { useEffect, useState } from 'react'
import { securityApi, type LateralEvent, type LateralSeverity } from '@/api'
import { Alert, Card, CardBody, CardHeader, CardTitle, Icon, IconBadge, IconButton, Modal } from '@/components/ui-v2'

const SEVERITY_ICON: Record<LateralSeverity, string> = {
  hi: 'circle-alert',
  med: 'triangle-alert',
  lo: 'info',
}

const SEVERITY_CLASS: Record<LateralSeverity, string> = {
  hi: 'c-danger',
  med: 'c-warning',
  lo: 'c-info',
}

export function LateralEventsCard() {
  const [events, setEvents] = useState<LateralEvent[] | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    securityApi.listLateralEvents().then(setEvents)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lateral events 7 days</CardTitle>
        <span className="spacer" />
        <IconButton variant="ghost" size="xs" aria-label="What this is" onClick={() => setInfoOpen(true)}>
          <Icon name="info" />
        </IconButton>
      </CardHeader>
      <CardBody>
        <div className="lateral">
          {events?.map((event) => (
            <div key={event.id}>
              <Icon name={SEVERITY_ICON[event.severity]} className={SEVERITY_CLASS[event.severity]} />
              <div>
                <p dangerouslySetInnerHTML={{ __html: event.message_html }} />
                <p className="t-body-sm c-tertiary" dangerouslySetInnerHTML={{ __html: event.action_html }} />
              </div>
            </div>
          ))}
        </div>
      </CardBody>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} size="xs" label="Lateral events" bare>
        <Alert
          variant="info"
          icon={
            <IconBadge variant="blue">
              <Icon name="info" />
            </IconBadge>
          }
          title="Lateral events"
          description="Attempts by one device to reach another inside the network. Most are harmless discovery traffic; the ones worth reading are grouped at the top."
        />
      </Modal>
    </Card>
  )
}
