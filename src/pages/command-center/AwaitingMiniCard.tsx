import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui'
import { deviceApi, type Device } from '@/api'
import { connectionLabel, deviceIcon, formatFirstSeen } from '@/pages/devices-awaiting/deviceDisplay'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FeedItem,
  Icon,
  IconBadge,
  IconButton,
  Modal,
} from '@/components/ui-v2'

interface AwaitingMiniCardProps {
  onNavigate: (tab: string) => void
}

export function AwaitingMiniCard({ onNavigate }: AwaitingMiniCardProps) {
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const { show: showToast } = useToast()

  const load = useCallback(() => {
    deviceApi.list({ status: 'awaiting' }).then(setDevices)
  }, [])

  useEffect(() => load(), [load])

  if (!devices || devices.length === 0) return null

  const block = (mac: string) => {
    deviceApi.block(mac).then((result) => {
      showToast(result.outcomeMessage)
      load()
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Devices awaiting registration</CardTitle>
          <IconButton variant="ghost" size="xs" aria-label="What this means" onClick={() => setInfoOpen(true)}>
            <Icon name="info" />
          </IconButton>
          <span className="spacer" />
          <Badge variant="amber">{devices.length} held</Badge>
        </CardHeader>
        <CardBody className="card__body--scroll">
          <div className="feed">
            {devices.map((device) => (
              <FeedItem
                key={device.mac}
                icon={
                  <IconBadge variant="neutral" size="sm">
                    <span>{deviceIcon(device)}</span>
                  </IconBadge>
                }
                title={`Looks like: ${device.inferred_type}`}
                meta={
                  <>
                    {connectionLabel(device)} · {device.mac} ({device.vendor}) · first seen{' '}
                    {formatFirstSeen(device.first_seen)}
                    {device.suggested_name && (
                      <>
                        <br />
                        Guardian suggests: <b>&quot;{device.suggested_name}&quot;</b>
                      </>
                    )}
                  </>
                }
                trailing={
                  <span className="feed__actions">
                    <Button variant="primary" size="xs" onClick={() => onNavigate('network')}>
                      Review
                    </Button>
                    <Button variant="danger" size="xs" onClick={() => block(device.mac)}>
                      Block
                    </Button>
                  </span>
                }
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} size="xs" label="What this means" bare>
        <Alert
          variant="info"
          icon={
            <IconBadge variant="blue">
              <Icon name="shield" />
            </IconBadge>
          }
          title="Info"
          description="Quarantine-first is ON — unknown devices get no internet or LAN access until you approve them. They can only request an address and wait."
          actions={
            <Button variant="secondary" size="sm" onClick={() => setInfoOpen(false)}>
              Close
            </Button>
          }
        />
      </Modal>
    </>
  )
}
