import { useEffect, useState } from 'react'
import { securityApi, type SecurityKpis } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { AttackOriginsCard } from './AttackOriginsCard'
import { AttackSimulationCard } from './AttackSimulationCard'
import { EastWestMatrixCard } from './EastWestMatrixCard'
import { LateralEventsCard } from './LateralEventsCard'
import { LiveThreatFeedCard } from './LiveThreatFeedCard'
import { ProtectionStackCard } from './ProtectionStackCard'
import { SecurityKpiRow } from './SecurityKpiRow'
import { StaffActivityGate } from './StaffActivityGate'
import './security.css'

type SubTab = 'threats' | 'staff'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to load.'
}

export function SecurityCenter(_props: ScreenProps) {
  const [subTab, setSubTab] = useState<SubTab>('threats')
  const [kpis, setKpis] = useState<SecurityKpis | null>(null)
  const [kpisError, setKpisError] = useState<string | null>(null)

  useEffect(() => {
    securityApi.getKpis().then(setKpis).catch((err) => setKpisError(errorMessage(err)))
  }, [])

  return (
    <div className="security-page">
      <h1>Security Center</h1>
      <p className="lead">
        Every packet entering or leaving your network is inspected in real time. This is what we stopped — so it
        never reached your business.
      </p>

      <div className="subtabs">
        <button className={subTab === 'threats' ? 'on' : ''} onClick={() => setSubTab('threats')}>
          Threats &amp; east-west
        </button>
        <button className={subTab === 'staff' ? 'on' : ''} onClick={() => setSubTab('staff')}>
          Staff activity
        </button>
      </div>

      {subTab === 'threats' ? (
        <div className="security-page" style={{ gap: 14 }}>
          <SecurityKpiRow kpis={kpis} error={kpisError} />

          <div className="grid g21">
            <LiveThreatFeedCard />
            <div>
              <ProtectionStackCard />
              <AttackOriginsCard />
            </div>
          </div>

          <div className="grid g21">
            <EastWestMatrixCard />
            <LateralEventsCard />
          </div>

          <AttackSimulationCard />
        </div>
      ) : (
        <StaffActivityGate />
      )}
    </div>
  )
}
