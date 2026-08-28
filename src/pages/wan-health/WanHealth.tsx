import { useEffect, useState } from 'react'
import { wanApi, type CloudApp, type IspIncident, type LatencySeries, type WanStatus } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { CloudAppHealthCard } from './CloudAppHealthCard'
import { IspIncidentsCard } from './IspIncidentsCard'
import { LatencyChart } from './LatencyChart'
import { WanStatusCards } from './WanStatusCards'

export function WanHealth(_props: ScreenProps) {
  const [status, setStatus] = useState<WanStatus | null>(null)
  const [series, setSeries] = useState<LatencySeries | null>(null)
  const [apps, setApps] = useState<CloudApp[] | null>(null)
  const [incidents, setIncidents] = useState<IspIncident[] | null>(null)

  const [primaryLatencyMs, setPrimaryLatencyMs] = useState<number | null>(null)
  const [liveLatencies, setLiveLatencies] = useState<Record<string, number>>({})

  useEffect(() => {
    wanApi.getStatus().then(setStatus)
    wanApi.getLatencySeries().then(setSeries)
    wanApi.listCloudApps().then(setApps)
    wanApi.listIspIncidents().then(setIncidents)
  }, [])

  useEffect(() => {
    const unsubscribe = wanApi.subscribePrimaryLatency(setPrimaryLatencyMs)
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = wanApi.subscribeCloudAppLatency((id, ms) => {
      setLiveLatencies((prev) => ({ ...prev, [id]: ms }))
    })
    return unsubscribe
  }, [])

  return (
    <>
      <div className="row" style={{ gridTemplateColumns: '350fr 610fr 610fr', flex: '0 0 auto', minBlockSize: 118 }}>
        <WanStatusCards status={status} primaryLatencyMs={primaryLatencyMs} />
      </div>

      <div className="row" style={{ gridTemplateColumns: 'minmax(0,1fr)', flex: '341 1 0', minBlockSize: 341 }}>
        <LatencyChart series={series} />
      </div>

      <div className="row" style={{ gridTemplateColumns: '1090fr 500fr', flex: '485 1 0', minBlockSize: 485 }}>
        <CloudAppHealthCard apps={apps} liveLatencies={liveLatencies} />
        <IspIncidentsCard incidents={incidents} />
      </div>
    </>
  )
}
