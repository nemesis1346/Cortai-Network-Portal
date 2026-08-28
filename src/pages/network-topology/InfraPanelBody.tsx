import type { InfraNode } from '@/api'
import { EventList, SpecGrid } from '@/components/ui-v2'
import { PanelActions } from './PanelActions'
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
