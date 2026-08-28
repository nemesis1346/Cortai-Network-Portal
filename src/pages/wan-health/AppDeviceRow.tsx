import type { CloudAppDevice } from '@/api'
import { Icon } from '@/components/ui-v2'

export function AppDeviceRow({ device }: { device: CloudAppDevice }) {
  return (
    <div className="topo-item">
      <Icon name={device.active ? 'circle-check-big' : 'circle-dot'} className={device.active ? 'c-success' : 'c-tertiary'} />
      <span className="topo-item__body">
        <span className="topo-item__name">
          {device.label}
          <span className="c-tertiary"> · {device.detail}</span>
        </span>
        <span className="topo-item__meta">{device.status}</span>
      </span>
      <span className="topo-item__aside">
        <span className="topo-item__name num">{device.time}</span>
        <span className="topo-item__meta">TODAY</span>
      </span>
      <span className="topo-item__aside">
        <span className="topo-item__name num">{device.volume}</span>
        <span className="topo-item__meta">DATA</span>
      </span>
    </div>
  )
}
