import { useEffect, useState } from 'react'
import { wanApi, type CloudApp, type IspIncident, type LatencySeries, type WanStatus } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { CloudAppHealthCard } from './CloudAppHealthCard'
import { IspIncidentsCard } from './IspIncidentsCard'
import { LatencyChart } from './LatencyChart'
import { WanStatusCards } from './WanStatusCards'
import './wan-health.css'

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
    <div className="wan-health-page">
      <div>
        <h1>Internet &amp; WAN Health</h1>
        <p className="lead">
          We monitor your internet provider every 10 seconds — latency, jitter, packet loss and outages — and switch
          you to backup automatically before you notice. When your ISP underdelivers, we have the evidence.
        </p>
      </div>

      <WanStatusCards status={status} primaryLatencyMs={primaryLatencyMs} />
      <LatencyChart series={series} />
      <CloudAppHealthCard apps={apps} liveLatencies={liveLatencies} />
      <IspIncidentsCard incidents={incidents} />
    </div>
  )
}
