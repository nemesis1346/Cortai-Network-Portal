import { useCallback, useEffect, useState } from 'react'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusPill,
  Table,
  Tabs,
  useToast,
  type TableColumn,
} from '@/components/ui'
import { deviceApi, VLAN_LABEL, type Device, type DeviceStatus } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { ApproveDrawer, type DrawerMode } from './ApproveDrawer'
import { connectionLabel, formatFirstSeen } from './deviceDisplay'
import './devices-awaiting.css'

const STATUS_TABS: { key: DeviceStatus; label: string }[] = [
  { key: 'awaiting', label: 'Awaiting' },
  { key: 'approved', label: 'Approved' },
  { key: 'quarantined', label: 'Quarantined' },
  { key: 'blocked', label: 'Blocked' },
]

const EMPTY_COPY: Record<DeviceStatus, { icon: string; title: string; sub?: string }> = {
  awaiting: { icon: '✅', title: 'No new devices — you’re all clear.' },
  approved: { icon: '📶', title: 'Nothing approved yet.' },
  quarantined: { icon: '🔒', title: 'Nothing quarantined right now.' },
  blocked: { icon: '⛔', title: 'Nothing blocked right now.' },
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

  if (error) return <ErrorState message={error} />
  if (!allDevices) return <LoadingState message="Loading devices…" />

  const counts: Record<DeviceStatus, number> = {
    awaiting: 0,
    approved: 0,
    quarantined: 0,
    blocked: 0,
  }
  for (const d of allDevices) counts[d.status] += 1

  const rows = allDevices.filter((d) => d.status === activeStatus)
  const selectedDevice = selectedMac ? (allDevices.find((d) => d.mac === selectedMac) ?? null) : null

  const openDrawer = (mac: string, mode: DrawerMode) => {
    setSelectedMac(mac)
    setDrawerMode(mode)
  }
  const closeDrawer = () => setSelectedMac(null)

  const columns: TableColumn<Device>[] = [
    { key: 'mac', header: 'MAC', render: (d) => <span className="mono-num">{d.mac}</span> },
    { key: 'vendor', header: 'Vendor (OUI)', render: (d) => d.vendor },
    { key: 'type', header: 'Type (inferred)', render: (d) => d.inferred_type },
    {
      key: 'switch_port',
      header: 'Switch port',
      render: (d) => (d.switch_port ? <span className="mono-num">{d.switch_port}</span> : '—'),
    },
    {
      key: 'vlan',
      header: 'VLAN',
      render: (d) => (d.vlan_assigned ? VLAN_LABEL[d.vlan_assigned] : VLAN_LABEL[d.vlan_current]),
    },
    { key: 'connection', header: 'Connection', render: connectionLabel },
    {
      key: 'first_seen',
      header: 'First seen',
      render: (d) => (
        <span title={d.first_seen} className="mono-num">
          {formatFirstSeen(d.first_seen)}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (d) => <StatusPill status={d.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (d) => (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {d.status === 'awaiting' ? (
            <>
              <button className="btn primary" onClick={() => openDrawer(d.mac, 'approve')}>
                Approve ▸
              </button>
              <button
                className="btn"
                onClick={() =>
                  deviceApi.quarantine(d.mac).then((r) => {
                    showToast(r.outcomeMessage)
                    load()
                  })
                }
              >
                Quarantine
              </button>
              <button
                className="btn danger"
                onClick={() =>
                  deviceApi.block(d.mac).then((r) => {
                    showToast(r.outcomeMessage)
                    load()
                  })
                }
              >
                Block
              </button>
            </>
          ) : (
            <button className="btn" onClick={() => openDrawer(d.mac, 'edit')}>
              Edit
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="devices-awaiting">
      <div className="card">
        <h3 style={{ marginBottom: 0 }}>
          Devices awaiting registration
        </h3>
        <Tabs
          tabs={STATUS_TABS.map((t) => ({ key: t.key, label: t.label, count: counts[t.key] }))}
          active={activeStatus}
          onChange={(key) => setActiveStatus(key as DeviceStatus)}
        />
        {rows.length === 0 ? (
          <EmptyState icon={EMPTY_COPY[activeStatus].icon} title={EMPTY_COPY[activeStatus].title} />
        ) : (
          <Table columns={columns} rows={rows} rowKey={(d) => d.mac} />
        )}
      </div>

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
    </div>
  )
}