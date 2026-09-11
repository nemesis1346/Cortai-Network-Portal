import { useCallback, useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  ErrorState,
  Input,
  LoadingState,
  Pagination,
  Table,
  Tabs,
  type TableColumn,
} from '@/components/ui-v2'
import { useToast } from '@/components/ui'
import { portalApi, VLAN_LABEL, type Device, type DeviceStatus } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { ApproveDrawer, type DrawerMode } from './ApproveDrawer'
import { connectionLabel, formatFirstSeen, statusBadgeVariant, statusLabel } from './deviceDisplay'

const STATUS_TABS: { key: DeviceStatus; label: string }[] = [
  { key: 'awaiting', label: 'Awaiting' },
  { key: 'approved', label: 'Approved' },
  { key: 'quarantined', label: 'Quarantined' },
]

const EMPTY_COPY: Record<DeviceStatus, { title: string; sub?: string }> = {
  awaiting: { title: 'No new devices — you’re all clear.' },
  approved: { title: 'Nothing approved yet.' },
  quarantined: { title: 'Nothing quarantined right now.' },
}

const PAGE_SIZE = 20

type SortKey = 'vendor' | 'type' | 'first_seen'

const SORT_DEFAULT_DIRECTION: Record<SortKey, 'asc' | 'desc'> = {
  vendor: 'asc',
  type: 'asc',
  first_seen: 'desc',
}

const BLOCK_CONFIRM = {
  title: 'Block this device?',
  description: "This bans the device network-wide via FortiManager. It won't be reachable until you manually reverse this.",
  confirmLabel: 'Block device',
}

export function DevicesAwaitingTable(_props: ScreenProps) {
  const [allDevices, setAllDevices] = useState<Device[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<DeviceStatus>('awaiting')
  const [searchText, setSearchText] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('first_seen')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [selectedMac, setSelectedMac] = useState<string | null>(null)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('approve')
  const [pendingBlockMac, setPendingBlockMac] = useState<string | null>(null)
  const [blocking, setBlocking] = useState(false)
  const { show: showToast } = useToast()

  const load = useCallback(() => {
    let cancelled = false
    portalApi.devices
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

  useEffect(() => {
    setPage(1)
  }, [activeStatus, searchText, sortKey, sortDirection])

  const counts: Record<DeviceStatus, number> = { awaiting: 0, approved: 0, quarantined: 0 }
  for (const d of allDevices ?? []) counts[d.status] += 1

  const statusRows = (allDevices ?? []).filter((d) => d.status === activeStatus)

  const query = searchText.trim().toLowerCase()
  const searchedRows = query
    ? statusRows.filter((d) =>
        [d.mac, d.vendor, d.inferred_type, d.name ?? d.suggested_name ?? ''].some((field) =>
          field.toLowerCase().includes(query),
        ),
      )
    : statusRows

  const direction = sortDirection === 'asc' ? 1 : -1
  const sortedRows = [...searchedRows].sort((a, b) => {
    if (sortKey === 'vendor') return a.vendor.localeCompare(b.vendor) * direction
    if (sortKey === 'type') return a.inferred_type.localeCompare(b.inferred_type) * direction
    return (new Date(a.first_seen).getTime() - new Date(b.first_seen).getTime()) * direction
  })

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const rows = sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const selectedDevice = selectedMac ? (allDevices?.find((d) => d.mac === selectedMac) ?? null) : null

  const handleSort = (key: string) => {
    if (key !== 'vendor' && key !== 'type' && key !== 'first_seen') return
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection(SORT_DEFAULT_DIRECTION[key])
    }
  }

  const openDrawer = (mac: string, mode: DrawerMode) => {
    setSelectedMac(mac)
    setDrawerMode(mode)
  }
  const closeDrawer = () => setSelectedMac(null)

  const runBlock = () => {
    if (!pendingBlockMac) return
    setBlocking(true)
    portalApi.devices
      .quarantine(pendingBlockMac)
      .then((r) => {
        showToast(r.outcomeMessage)
        setPendingBlockMac(null)
        load()
      })
      .finally(() => setBlocking(false))
  }

  const columns: TableColumn<Device>[] = [
    { key: 'mac', header: 'MAC', width: '160fr', render: (d) => <span className="num">{d.mac}</span> },
    { key: 'vendor', header: 'Vendor (OUI)', width: '120fr', sortable: true, render: (d) => d.vendor },
    { key: 'type', header: 'Type (inferred)', width: '130fr', sortable: true, render: (d) => d.inferred_type },
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
      sortable: true,
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
            <Button variant="danger" size="xs" onClick={() => setPendingBlockMac(d.mac)}>
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

  const emptyCopy = query
    ? { title: `No matches for “${searchText.trim()}”.` }
    : EMPTY_COPY[activeStatus]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Devices awaiting registration</CardTitle>
          <span className="spacer" />
          <Input
            placeholder="Search MAC, vendor, type, name…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 280 }}
          />
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
              <h4>{emptyCopy.title}</h4>
              {'sub' in emptyCopy && emptyCopy.sub && <p>{emptyCopy.sub}</p>}
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                rows={rows}
                rowKey={(d) => d.mac}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              {pageCount > 1 && <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />}
            </>
          )}
        </CardBody>
      </Card>

      <ApproveDrawer
        device={selectedDevice}
        mode={drawerMode}
        onClose={closeDrawer}
        onApprove={(body) =>
          portalApi.devices.approve(selectedDevice!.mac, body).then((r) => {
            showToast(r.outcomeMessage)
            closeDrawer()
            load()
          })
        }
        onBlock={() =>
          portalApi.devices.quarantine(selectedDevice!.mac).then((r) => {
            showToast(r.outcomeMessage)
            closeDrawer()
            load()
          })
        }
        onSave={(body) =>
          portalApi.devices.patch(selectedDevice!.mac, body).then((r) => {
            showToast(r.outcomeMessage)
            closeDrawer()
            load()
          })
        }
      />

      <ConfirmDialog
        open={pendingBlockMac !== null}
        title={BLOCK_CONFIRM.title}
        description={BLOCK_CONFIRM.description}
        confirmLabel={BLOCK_CONFIRM.confirmLabel}
        confirming={blocking}
        onCancel={() => setPendingBlockMac(null)}
        onConfirm={runBlock}
      />
    </>
  )
}
