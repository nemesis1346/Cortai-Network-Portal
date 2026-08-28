import type { CloudApp } from '@/api'
import {
  Button,
  Icon,
  IconBadge,
  IconButton,
  Modal,
  ModalBody,
  ModalFoot,
  ModalHead,
  ModalRule,
  ModalSub,
  ModalTitle,
  SpecGrid,
} from '@/components/ui-v2'
import { useToast } from '@/components/ui'
import { AppDeviceRow } from './AppDeviceRow'

interface WhoIsUsingItModalProps {
  app: CloudApp | null
  onClose: () => void
}

export function WhoIsUsingItModal({ app, onClose }: WhoIsUsingItModalProps) {
  const { show: showToast } = useToast()

  return (
    <Modal open={Boolean(app)} onClose={onClose} label={app ? `${app.name} · ${app.tag}` : 'App detail'}>
      {app && (
        <>
          <ModalHead>
            <IconBadge variant="blue">
              <Icon name="cloud" />
            </IconBadge>
            <div>
              <ModalTitle>
                {app.name} · {app.tag}
              </ModalTitle>
              <ModalSub>
                {app.meta} · 7-day window
              </ModalSub>
            </div>
            <span className="spacer" />
            <IconButton variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
              <Icon name="x" />
            </IconButton>
          </ModalHead>
          <ModalRule />

          <ModalBody>
            <SpecGrid
              rows={[
                { label: 'Response now', value: `${app.nowMs.toFixed(0)} ms`, danger: app.verdict === 'degraded' },
                { label: '30-day baseline', value: `${app.baselineMs} ms` },
                { label: 'Uptime · business hours', value: `${app.uptimePercent}%` },
                { label: 'Path', value: 'LAN → Firewall → Bell → Internet' },
              ]}
            />

            <p className="section-title">Who&rsquo;s on it right now</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
              {app.devices.map((device) => (
                <AppDeviceRow key={device.id} device={device} />
              ))}
            </div>
            {app.deviceNote && <p className="t-body-sm c-tertiary">{app.deviceNote}</p>}
            {app.allowListNote && <p className="t-body-sm c-tertiary" dangerouslySetInnerHTML={{ __html: app.allowListNote }} />}
          </ModalBody>

          <ModalFoot>
            <Button variant="primary" size="sm" onClick={() => showToast('Path test started')}>
              Run path test
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </ModalFoot>
        </>
      )}
    </Modal>
  )
}
