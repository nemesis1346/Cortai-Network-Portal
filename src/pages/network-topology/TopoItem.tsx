import { Icon } from '@/components/ui-v2'
import type { ClusterDeviceRow } from '@/api'

interface TopoItemProps {
  device: ClusterDeviceRow
  onClick: () => void
}

export function TopoItem({ device, onClick }: TopoItemProps) {
  return (
    <button type="button" className={`topo-item${device.danger ? ' topo-item--danger' : ''}`} onClick={onClick}>
      <Icon name={device.danger ? 'circle-x' : 'circle-check-big'} />
      <span className="topo-item__body">
        <span className="topo-item__name">
          {device.id}
          <span className="c-tertiary"> · {device.location}</span>
        </span>
        <span className="topo-item__meta">{device.meta}</span>
      </span>
      <span className="topo-item__aside">
        <span className={`topo-item__name num${device.danger ? ' c-danger' : ''}`}>{device.rate}</span>
        <span className={`topo-item__meta${device.danger ? ' c-danger' : ''}`}>{device.uptime}</span>
      </span>
    </button>
  )
}
