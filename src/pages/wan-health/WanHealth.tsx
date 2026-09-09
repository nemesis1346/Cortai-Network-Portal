import { useEffect, useState } from 'react'
import { errorMessage, portalApi, type CloudApp, type IspIncident, type LatencySeries, type WanStatus } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { CloudAppHealthCard } from './CloudAppHealthCard'
import { IspIncidentsCard } from './IspIncidentsCard'
import { LatencyChart } from './LatencyChart'
import { WanStatusCards } from './WanStatusCards'

export function WanHealth(_props: ScreenProps) {
  const [status, setStatus] = useState<WanStatus | null>(null)
  const [statusReason, setStatusReason] = useState<string | null>(null)
  const [series, setSeries] = useState<LatencySeries | null>(null)
  const [apps, setApps] = useState<CloudApp[] | null>(null)
  const [appsReason, setAppsReason] = useState<string | null>(null)
  const [incidents, setIncidents] = useState<IspIncident[] | null>(null)
  const [incidentsReason, setIncidentsReason] = useState<string | null>(null)

  const [primaryLatencyMs, setPrimaryLatencyMs] = useState<number | null>(null)
  const [liveLatencies, setLiveLatencies] = useState<Record<string, number>>({})

  useEffect(() => {
    portalApi.wan.getStatus().then(setStatus).catch((err) => setStatusReason(errorMessage(err)))
    portalApi.wan.getLatencySeries().then(setSeries)
    portalApi.wan.listCloudApps().then(setApps).catch((err) => setAppsReason(errorMessage(err)))
    portalApi.wan.listIspIncidents().then(setIncidents).catch((err) => setIncidentsReason(errorMessage(err)))
  }, [])

  useEffect(() => {
    const unsubscribe = portalApi.wan.subscribePrimaryLatency(setPrimaryLatencyMs)
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = portalApi.wan.subscribeCloudAppLatency((id, ms) => {
      setLiveLatencies((prev) => ({ ...prev, [id]: ms }))
    })
    return unsubscribe
  }, [])

  return (
    <>
      <div className="row" style={{ gridTemplateColumns: '350fr 610fr 610fr', flex: '0 0 auto', minBlockSize: 118 }}>
        <WanStatusCards status={status} statusReason={statusReason} primaryLatencyMs={primaryLatencyMs} />
      </div>

      <div className="row" style={{ gridTemplateColumns: 'minmax(0,1fr)', flex: '341 1 0', minBlockSize: 341 }}>
        <LatencyChart series={series} />
      </div>

      <div className="row" style={{ gridTemplateColumns: '1090fr 500fr', flex: '485 1 0', minBlockSize: 485 }}>
        <CloudAppHealthCard apps={apps} appsReason={appsReason} liveLatencies={liveLatencies} />
        <IspIncidentsCard incidents={incidents} incidentsReason={incidentsReason} />
      </div>
    </>
  )
}
