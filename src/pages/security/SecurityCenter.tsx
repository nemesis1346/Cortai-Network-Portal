import { useEffect, useState } from 'react'
import { securityApi, type SecurityKpis } from '@/api'
import { Button, Tabs } from '@/components/ui-v2'
import type { ScreenProps } from '@/shell/nav-data'
import { AttackOriginsCard } from './AttackOriginsCard'
import { AttackSimulationCard } from './AttackSimulationCard'
import { EastWestMatrixCard } from './EastWestMatrixCard'
import { LateralEventsCard } from './LateralEventsCard'
import { LiveThreatFeedCard } from './LiveThreatFeedCard'
import { ProtectionStackCard } from './ProtectionStackCard'
import { SecurityKpiRow } from './SecurityKpiRow'
import { StaffActivityGate } from './StaffActivityGate'

type SubTab = 'threats' | 'staff'

const TABS = [
  { key: 'threats', label: 'Threats & east-west' },
  { key: 'staff', label: 'Staff activity' },
]

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to load.'
}

export function SecurityCenter(_props: ScreenProps) {
  const [subTab, setSubTab] = useState<SubTab>('threats')
  const [kpis, setKpis] = useState<SecurityKpis | null>(null)
  const [kpisError, setKpisError] = useState<string | null>(null)
  const [simOpen, setSimOpen] = useState(false)

  useEffect(() => {
    securityApi.getKpis().then(setKpis).catch((err) => setKpisError(errorMessage(err)))
  }, [])

  return (
    <>
      <div className="pagebar">
        <Tabs tabs={TABS} active={subTab} onChange={(key) => setSubTab(key as SubTab)} />
        <span className="spacer" />
        {subTab === 'threats' && (
          <Button variant="secondary" size="sm" onClick={() => setSimOpen(true)}>
            Attack simulation
          </Button>
        )}
      </div>

      {subTab === 'threats' ? (
        <>
          <div className="row" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', flex: '0 0 auto' }}>
            <SecurityKpiRow kpis={kpis} error={kpisError} />
          </div>

          <div className="row" style={{ gridTemplateColumns: '1fr 1fr', flex: '0 0 400px', minBlockSize: 400 }}>
            <LiveThreatFeedCard />
            <EastWestMatrixCard />
          </div>

          <div className="row" style={{ gridTemplateColumns: '1fr 1fr 1fr', flex: '326 1 0', minBlockSize: 330 }}>
            <ProtectionStackCard />
            <AttackOriginsCard />
            <LateralEventsCard />
          </div>

          <AttackSimulationCard open={simOpen} onClose={() => setSimOpen(false)} />
        </>
      ) : (
        <StaffActivityGate />
      )}
    </>
  )
}
