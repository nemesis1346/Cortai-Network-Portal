import { useState } from 'react'
import type { IspIncident } from '@/api'
import { Card, CardBody, CardHeader, CardTitle, EventList, Segmented } from '@/components/ui-v2'

const RANGE_OPTIONS = [
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
]

interface IspIncidentsCardProps {
  incidents: IspIncident[] | null
}

export function IspIncidentsCard({ incidents }: IspIncidentsCardProps) {
  const [range, setRange] = useState('30d')

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
