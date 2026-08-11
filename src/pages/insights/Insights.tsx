import { useEffect, useState } from 'react'
import { deviceApi, insightsApi, type Device, type InsightsData } from '@/api'
import { displayName } from '@/pages/devices-awaiting/deviceDisplay'
import { StaffActivityGate } from '@/pages/security/StaffActivityGate'
import type { ScreenProps } from '@/shell/nav-data'
import { InsightsCallouts } from './InsightsCallouts'
import { TopDestinationsCard } from './TopDestinationsCard'
import { TopTalkersCard } from './TopTalkersCard'
import { UsageHeatmap } from './UsageHeatmap'
import './insights.css'

function isLaptop(device: Device): boolean {
  return device.inferred_type.toLowerCase().includes('laptop')
}

export function Insights(_props: ScreenProps) {
  const [laptops, setLaptops] = useState<Device[]>([])
  const [scope, setScope] = useState('all')
  const [data, setData] = useState<InsightsData | null>(null)

  useEffect(() => {
    deviceApi.list({ status: 'approved' }).then((rows) => setLaptops(rows.filter(isLaptop)))
  }, [])

  useEffect(() => {
    setData(null)
    insightsApi.getInsights(scope).then(setData)
  }, [scope])

  return (
    <div className="insights-page">
      <div className="ins-head">
        <div>
          <h1>Insights</h1>
          <p className="lead">How your business actually uses the network — when, where to, by whom.</p>
        </div>
        <select className="devsel" value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="all">All devices</option>
          {laptops.map((d) => (
            <option key={d.mac} value={d.mac}>
              {displayName(d)}
            </option>
          ))}
        </select>
      </div>

      <InsightsCallouts callouts={data?.callouts ?? null} />
      <UsageHeatmap cells={data?.heatmap ?? null} />

      <div className="grid g21">
        <TopDestinationsCard destinations={data?.topDestinations ?? null} scopeLabel={data?.scopeLabel ?? null} />
        <TopTalkersCard talkers={data?.topTalkers ?? null} />
      </div>

      <div style={{ marginTop: 14 }}>
        <StaffActivityGate />
      </div>
    </div>
  )
}
