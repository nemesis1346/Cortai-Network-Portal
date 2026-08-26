import { useCallback, useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ErrorState,
  LoadingState,
  Table,
  Tabs,
  type TableColumn,
} from '@/components/ui-v2'
import { useToast } from '@/components/ui'
import { deviceApi, VLAN_LABEL, type Device, type DeviceStatus } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { ApproveDrawer, type DrawerMode } from './ApproveDrawer'
import { connectionLabel, formatFirstSeen, statusBadgeVariant, statusLabel } from './deviceDisplay'

const STATUS_TABS: { key: DeviceStatus; label: string }[] = [
  { key: 'awaiting', label: 'Awaiting' },
  { key: 'approved', label: 'Approved' },
  { key: 'quarantined', label: 'Quarantined' },
  { key: 'blocked', label: 'Blocked' },
]

const EMPTY_COPY: Record<DeviceStatus, { title: string; sub?: string }> = {
  awaiting: { title: 'No new devices — you’re all clear.' },
  approved: { title: 'Nothing approved yet.' },
  quarantined: { title: 'Nothing quarantined right now.' },
  blocked: { title: 'Nothing blocked right now.' },
}

export function DevicesAwaitingTable(_props: ScreenProps) {
  const [allDevices, setAllDevices] = useState<Device[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<DeviceStatus>('awaiting')
  const [selectedMac, setSelectedMac] = useState<string | null>(null)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('approve')
  const { show: showToast } = useToast()

  const load = useCallback(() => {
    let cancelled = false
    deviceApi
      .list({})
      .then((rows) => {
        if (cancelled) return
        setAllDevices(rows)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load devices.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => load(), [load])

  const counts: Record<DeviceStatus, number> = {
    awaiting: 0,
    approved: 0,
    quarantined: 0,
    blocked: 0,
  }
  for (const d of allDevices ?? []) counts[d.status] += 1

  const rows = (allDevices ?? []).filter((d) => d.status === activeStatus)
  const selectedDevice = selectedMac ? (allDevices?.find((d) => d.mac === selectedMac) ?? null) : null

  const openDrawer = (mac: string, mode: DrawerMode) => {
    setSelectedMac(mac)
    setDrawerMode(mode)
  }
  const closeDrawer = () => setSelectedMac(null)

  const columns: TableColumn<Device>[] = [
    { key: 'mac', header: 'MAC', width: '160fr', render: (d) => <span className="num">{d.mac}</span> },
    { key: 'vendor', header: 'Vendor (OUI)', width: '120fr', render: (d) => d.vendor },
    { key: 'type', header: 'Type (inferred)', width: '130fr', render: (d) => d.inferred_type },
    {
      key: 'switch_port',
      header: 'Switch port',
      width: '90fr',
      render: (d) => (d.switch_port ? <span className="num">{d.switch_port}</span> : '—'),
    },
    {
      key: 'vlan',
      header: 'VLAN',
      width: '90fr',
      render: (d) => (d.vlan_assigned ? VLAN_LABEL[d.vlan_assigned] : VLAN_LABEL[d.vlan_current]),
    },
    { key: 'connection', header: 'Connection', width: '140fr', render: connectionLabel },
    {
      key: 'first_seen',
      header: 'First seen',
      width: '120fr',
      render: (d) => (
        <span title={d.first_seen} className="num">
          {formatFirstSeen(d.first_seen)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100fr',
      render: (d) => <Badge variant={statusBadgeVariant(d.status)}>{statusLabel(d.status)}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '220fr',
      render: (d) =>
        d.status === 'awaiting' ? (
          <>
            <Button variant="primary" size="xs" onClick={() => openDrawer(d.mac, 'approve')}>
              Approve
            </Button>
            <Button
              variant="secondary"
              size="xs"
              onClick={() =>
                deviceApi.quarantine(d.mac).then((r) => {
                  showToast(r.outcomeMessage)
                  load()
                })
              }
            >
              Quarantine
            </Button>
            <Button
              variant="danger"
              size="xs"
              onClick={() =>
                deviceApi.block(d.mac).then((r) => {
                  showToast(r.outcomeMessage)
                  load()
                })
              }
            >
              Block
            </Button>
          </>
        ) : (
          <Button variant="secondary" size="xs" onClick={() => openDrawer(d.mac, 'edit')}>
            Edit
          </Button>
        ),
    },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Devices awaiting registration</CardTitle>
        </CardHeader>
        <CardBody>
          <Tabs
            tabs={STATUS_TABS.map((t) => ({ key: t.key, label: t.label, count: counts[t.key] }))}
            active={activeStatus}
            onChange={(key) => setActiveStatus(key as DeviceStatus)}
          />
          {error ? (
            <ErrorState message={error} />
          ) : !allDevices ? (
            <LoadingState message="Loading devices…" />
          ) : rows.length === 0 ? (
            <div className="table__empty">
              <h4>{EMPTY_COPY[activeStatus].title}</h4>
              {EMPTY_COPY[activeStatus].sub && <p>{EMPTY_COPY[activeStatus].sub}</p>}
            </div>
          ) : (
            <Table columns={columns} rows={rows} rowKey={(d) => d.mac} />
          )}
        </CardBody>
      </Card>

      <ApproveDrawer
        device={selectedDevice}
        mode={drawerMode}
        onClose={closeDrawer}
        onApprove={(body) =>
          deviceApi.approve(selectedDevice!.mac, body).then((r) => {
            showToast(r.outcomeMessage)
            closeDrawer()
            load()
          })
        }
        onQuarantine={() =>
          deviceApi.quarantine(selectedDevice!.mac).then((r) => {
            showToast(r.outcomeMessage)
            closeDrawer()
            load()
          })
        }
        onBlock={() =>
          deviceApi.block(selectedDevice!.mac).then((r) => {
            showToast(r.outcomeMessage)
            closeDrawer()
            load()
          })
        }
        onSave={(body) =>
          deviceApi.patch(selectedDevice!.mac, body).then((r) => {
            showToast(r.outcomeMessage)
            closeDrawer()
            load()
          })
        }
      />
    </>
  )
}
