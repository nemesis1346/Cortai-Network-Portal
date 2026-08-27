import { Alert, Icon, IconBadge } from '@/components/ui-v2'
import type { DeviceDetail } from '@/api'
import { AppList } from './AppList'
import { EventList } from './EventList'
import { PanelActions } from './PanelActions'
import { SpecGrid } from './SpecGrid'
import { TrafficCard } from './TrafficCard'

export function DevicePanelBody({ device }: { device: DeviceDetail }) {
  return (
    <div className="net-panel__body v2-scrollbars">
      <PanelActions actions={device.actions} />
      {device.fault && (
        <Alert
          variant="danger"
          icon={
            <IconBadge variant="red" size="sm">
              <Icon name="circle-alert" />
            </IconBadge>
          }
          title={device.fault.title}
          description={device.fault.description}
        />
      )}
      <section>
        <p className="section-title">System</p>
        <SpecGrid rows={device.spec} />
      </section>
      <TrafficCard traffic={device.traffic} />
      {device.apps && <AppList rows={device.apps} />}
      {device.events && <EventList title="Recent events" rows={device.events} />}
    </div>
  )
}
