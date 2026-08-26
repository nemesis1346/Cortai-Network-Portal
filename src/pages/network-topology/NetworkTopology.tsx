import { useEffect, useState } from 'react'
import { topologyApi, type ClusterNode, type DeviceDetail, type InfraNode } from '@/api'
import { NetworkPanel, type PanelState } from './NetworkPanel'
import { TopologyCanvas } from './TopologyCanvas'

const MOBILE_QUERY = '(max-width: 767.98px)'

export function NetworkTopology() {
  const [infraNodes, setInfraNodes] = useState<InfraNode[]>([])
  const [clusterNodes, setClusterNodes] = useState<ClusterNode[]>([])
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetail[]>([])
  const [panel, setPanel] = useState<PanelState | null>(null)

  useEffect(() => {
    topologyApi.listInfraNodes().then(setInfraNodes)
    topologyApi.listClusterNodes().then(setClusterNodes)
    topologyApi.listDeviceDetails().then(setDeviceDetails)
  }, [])

  const close = () => setPanel(null)

  const selectNode = (key: string) => {
    const isCluster = clusterNodes.some((n) => n.key === key)
    setPanel(isCluster ? { kind: 'cluster', key } : { kind: 'infra', key })
  }

  const selectCluster = (key: string) => setPanel({ kind: 'cluster', key })

  const selectDevice = (id: string, parentKey: string) => {
    if (deviceDetails.some((d) => d.id === id)) {
      setPanel({ kind: 'device', id, parentKey })
    }
    // else: no DETAIL card for this device — stay on the cluster list, matching the source's own fallback.
  }

  const selectedKey = panel && (panel.kind === 'infra' || panel.kind === 'cluster') ? panel.key : null

  useEffect(() => {
    if (!panel) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('.modal-scrim')) close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [panel])

  useEffect(() => {
    if (!panel || !window.matchMedia(MOBILE_QUERY).matches) return
    document.body.classList.add('is-sheet-open')
    return () => document.body.classList.remove('is-sheet-open')
  }, [panel])

  useEffect(() => {
    if (!panel) return
    const onClick = (e: MouseEvent) => {
      if (!document.body.classList.contains('is-sheet-open')) return
      const target = e.target as HTMLElement
      if (!target.closest('.net-panel') && !target.closest('.net-node') && !target.closest('.modal-scrim')) close()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [panel])

  return (
    <div className="net-layout" data-panel={panel ? 'open' : 'closed'}>
      <TopologyCanvas
        infraNodes={infraNodes}
        clusterNodes={clusterNodes}
        selectedKey={selectedKey}
        onSelect={selectNode}
      />
      {panel && (
        <NetworkPanel
          panel={panel}
          infraNodes={infraNodes}
          clusterNodes={clusterNodes}
          deviceDetails={deviceDetails}
          onClose={close}
          onSelectCluster={selectCluster}
          onSelectDevice={selectDevice}
        />
      )}
    </div>
  )
}
