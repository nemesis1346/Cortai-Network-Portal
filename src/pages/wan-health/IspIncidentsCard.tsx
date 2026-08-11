import type { IspIncident } from '@/api'

interface IspIncidentsCardProps {
  incidents: IspIncident[] | null
}

export function IspIncidentsCard({ incidents }: IspIncidentsCardProps) {
  return (
    <div className="card">
      <h3>ISP incidents we handled — last 90 days</h3>
      {incidents?.map((incident) => (
        <div key={incident.date} className="wan-ev">
          <span className="d mono-num">{incident.date}</span>
          <span className="m" dangerouslySetInnerHTML={{ __html: incident.message_html }} />
        </div>
      ))}
    </div>
  )
}
