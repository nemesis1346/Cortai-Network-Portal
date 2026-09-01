import { useEffect, useState } from 'react'
import { deviceApi, insightsApi, type Device, type InsightsData } from '@/api'
import { Select } from '@/components/ui-v2'
import { displayName } from '@/pages/devices-awaiting/deviceDisplay'
import { StaffActivityGate } from '@/pages/security/StaffActivityGate'
import type { ScreenProps } from '@/shell/nav-data'
import { InsightsCallouts } from './InsightsCallouts'
import { TopDestinationsCard } from './TopDestinationsCard'
import { TopTalkersCard } from './TopTalkersCard'
import { UsageHeatmap } from './UsageHeatmap'

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
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)', flex: '0 0 auto', marginBlockEnd: 'var(--spacing-20)', flexWrap: 'wrap' }}>
        <InsightsCallouts callouts={data?.callouts ?? null} />
        <span className="spacer" />
        <div style={{ inlineSize: 160 }}>
          <Select
            size="sm"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[{ value: 'all', label: 'All devices' }, ...laptops.map((d) => ({ value: d.mac, label: displayName(d) }))]}
          />
        </div>
      </div>

      <div className="row" style={{ gridTemplateColumns: 'minmax(0,1fr)', flex: '0 0 auto' }}>
        <UsageHeatmap cells={data?.heatmap ?? null} />
      </div>

      <div className="row" style={{ gridTemplateColumns: '1fr 1fr', flex: '0 0 auto', minBlockSize: 392 }}>
        <TopDestinationsCard destinations={data?.topDestinations ?? null} scopeLabel={data?.scopeLabel ?? null} />
        <TopTalkersCard talkers={data?.topTalkers ?? null} />
      </div>

      <div className="row" style={{ gridTemplateColumns: 'minmax(0,1fr)', flex: '0 0 auto' }}>
        <StaffActivityGate />
      </div>
    </>
  )
}
