import type { ClusterNode } from '@/api'
import { TopoItem } from './TopoItem'

interface ClusterPanelBodyProps {
  node: ClusterNode
  onSelectDevice: (id: string, parentKey: string) => void
}

export function ClusterPanelBody({ node, onSelectDevice }: ClusterPanelBodyProps) {
  return (
    <div className="net-panel__body">
      <section>
        <p className="section-title">Devices ({node.devices.length})</p>
        <div className="topo-list">
          {node.devices.map((d) => (
            <TopoItem key={d.id} device={d} onClick={() => onSelectDevice(d.id, node.key)} />
          ))}
        </div>
      </section>
    </div>
  )
}
