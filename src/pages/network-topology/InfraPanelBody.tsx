import type { InfraNode } from '@/api'
import { EventList } from './EventList'
import { PanelActions } from './PanelActions'
import { SpecGrid } from './SpecGrid'
import { TrafficCard } from './TrafficCard'

export function InfraPanelBody({ node }: { node: InfraNode }) {
  return (
    <div className="net-panel__body v2-scrollbars">
      <PanelActions actions={node.actions} />
      <section>
        <p className="section-title">System</p>
        <SpecGrid rows={node.spec} />
      </section>
      <TrafficCard traffic={node.traffic} />
      <EventList title="Recent events" rows={node.events} />
    </div>
  )
}
