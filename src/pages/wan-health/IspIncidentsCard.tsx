import { useState } from 'react'
import type { IspIncident } from '@/api'
import { Card, CardBody, CardHeader, CardTitle, EventList, Segmented, Unavailable } from '@/components/ui-v2'

const RANGE_OPTIONS = [
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
]

interface IspIncidentsCardProps {
  incidents: IspIncident[] | null
  incidentsReason: string | null
}

export function IspIncidentsCard({ incidents, incidentsReason }: IspIncidentsCardProps) {
  const [range, setRange] = useState('30d')

  if (incidentsReason) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ISP incidents we handled</CardTitle>
        </CardHeader>
        <CardBody>
          <Unavailable title="ISP incidents unavailable" reason={incidentsReason} />
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ISP incidents we handled</CardTitle>
        <span className="spacer" />
        <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </CardHeader>
      <CardBody>
        <EventList rows={(incidents ?? []).map((incident) => ({ time: incident.date, text_html: incident.message_html }))} />
      </CardBody>
    </Card>
  )
}
