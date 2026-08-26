import type { ReactNode } from 'react'
import { Badge, Icon, IconButton } from '@/components/ui-v2'
import type { ClusterNode, DeviceDetail, InfraNode } from '@/api'
import { ClusterPanelBody } from './ClusterPanelBody'
import { DevicePanelBody } from './DevicePanelBody'
import { InfraPanelBody } from './InfraPanelBody'

export type PanelState =
  | { kind: 'infra'; key: string }
  | { kind: 'cluster'; key: string }
  | { kind: 'device'; id: string; parentKey: string }

interface NetworkPanelProps {
  panel: PanelState
  infraNodes: InfraNode[]
  clusterNodes: ClusterNode[]
  deviceDetails: DeviceDetail[]
  onClose: () => void
  onSelectCluster: (key: string) => void
  onSelectDevice: (id: string, parentKey: string) => void
}

const BADGE_VARIANT: Record<InfraNode['status']['tone'], 'success' | 'warning' | 'danger'> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
}

function PanelHead({
  crumbs,
  title,
  status,
  sub,
  onClose,
}: {
  crumbs: ReactNode
  title: string
  status: InfraNode['status']
  sub: string
  onClose: () => void
}) {
  const danger = status.tone === 'danger'
  return (
    <>
      <div className="net-panel__head">
        <nav className="crumbs">{crumbs}</nav>
        <span className="spacer" />
        <IconButton variant="ghost" size="sm" aria-label="Close panel" onClick={onClose}>
          <Icon name="x" />
        </IconButton>
      </div>
      <div className="net-panel__title">
        <h2 className={danger ? 'is-danger' : undefined}>{title}</h2>
        <Badge variant={BADGE_VARIANT[status.tone]} dot>
          {status.label}
        </Badge>
      </div>
      <p className="t-body-sm c-tertiary">{sub}</p>
    </>
  )
}

function HomeCrumb({ onClose }: { onClose: () => void }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      Topology
    </a>
  )
}

export function NetworkPanel({
  panel,
  infraNodes,
  clusterNodes,
  deviceDetails,
  onClose,
  onSelectCluster,
  onSelectDevice,
}: NetworkPanelProps) {
  if (panel.kind === 'infra') {
    const node = infraNodes.find((n) => n.key === panel.key)
    if (!node) return null
    return (
      <aside className="card net-panel drawer">
        <PanelHead
          crumbs={
            <>
              <HomeCrumb onClose={onClose} />
              <span className="crumbs__sep">›</span>
              <span aria-current="true">{node.crumb}</span>
            </>
          }
          title={node.title}
          status={node.status}
          sub={node.sub}
          onClose={onClose}
        />
        <InfraPanelBody node={node} />
      </aside>
    )
  }

  if (panel.kind === 'cluster') {
    const node = clusterNodes.find((n) => n.key === panel.key)
    if (!node) return null
    return (
      <aside className="card net-panel drawer">
        <PanelHead
          crumbs={
            <>
              <HomeCrumb onClose={onClose} />
              <span className="crumbs__sep">›</span>
              <span aria-current="true">{node.crumb}</span>
            </>
          }
          title={node.title}
          status={node.status}
          sub={node.sub}
          onClose={onClose}
        />
        <ClusterPanelBody node={node} onSelectDevice={onSelectDevice} />
      </aside>
    )
  }

  const device = deviceDetails.find((d) => d.id === panel.id)
  const parent = clusterNodes.find((n) => n.key === panel.parentKey)
  if (!device || !parent) return null
  return (
    <aside className="card net-panel drawer">
      <PanelHead
        crumbs={
          <>
            <HomeCrumb onClose={onClose} />
            <span className="crumbs__sep">›</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onSelectCluster(parent.key)
              }}
            >
              {parent.crumb}
            </a>
            <span className="crumbs__sep">›</span>
            <span aria-current="true">{device.title}</span>
          </>
        }
        title={device.title}
        status={device.status}
        sub={device.sub}
        onClose={onClose}
      />
      <DevicePanelBody device={device} />
    </aside>
  )
}
