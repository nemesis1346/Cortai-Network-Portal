import { useState } from 'react'
import { Segmented } from '@/components/ui-v2'
import { DevicesAwaitingTable } from '@/pages/devices-awaiting/DevicesAwaitingTable'
import { NetworkTopology } from '@/pages/network-topology/NetworkTopology'
import type { ScreenProps } from '@/shell/nav-data'

const VIEW_OPTIONS = [
  { key: 'awaiting', label: 'Awaiting Registration' },
  { key: 'topology', label: 'Topology' },
]

export function NetworkPage(props: ScreenProps) {
  const [view, setView] = useState<'awaiting' | 'topology'>('awaiting')

  return (
    <>
      <Segmented options={VIEW_OPTIONS} value={view} onChange={(key) => setView(key as 'awaiting' | 'topology')} />
      {view === 'awaiting' ? <DevicesAwaitingTable {...props} /> : <NetworkTopology />}
    </>
  )
}
