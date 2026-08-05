import { useEffect, useState } from 'react'
import { homeApi, type AttentionItem, type Briefing, type HomeHealth, type HomeKpis } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { AwaitingMiniCard } from './AwaitingMiniCard'
import { BriefingCard } from './BriefingCard'
import { HealthRingSection } from './HealthRingSection'
import { ImpactBanner } from './ImpactBanner'
import { LiveActivityFeed } from './LiveActivityFeed'
import { NeedsAttentionList } from './NeedsAttentionList'
import { QuickActionsCard } from './QuickActionsCard'
import './command-center.css'

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to load.'
}

export function CommandCenter({ onNavigate }: ScreenProps) {
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [briefingError, setBriefingError] = useState<string | null>(null)
  const [kpis, setKpis] = useState<HomeKpis | null>(null)
  const [kpisError, setKpisError] = useState<string | null>(null)
  const [health, setHealth] = useState<HomeHealth | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [attention, setAttention] = useState<AttentionItem[] | null>(null)
  const [attentionError, setAttentionError] = useState<string | null>(null)

  useEffect(() => {
    homeApi.getBriefing().then(setBriefing).catch((err) => setBriefingError(errorMessage(err)))
    homeApi.getKpis('1d').then(setKpis).catch((err) => setKpisError(errorMessage(err)))
    homeApi.getHealth().then(setHealth).catch((err) => setHealthError(errorMessage(err)))
    homeApi.listAttention().then(setAttention).catch((err) => setAttentionError(errorMessage(err)))
  }, [])

  return (
    <div className="command-center">
      <BriefingCard briefing={briefing} error={briefingError} onNavigate={onNavigate} />
      <ImpactBanner kpis={kpis} error={kpisError} />
      <AwaitingMiniCard onNavigate={onNavigate} />
      <HealthRingSection health={health} error={healthError} onNavigate={onNavigate} />
      <div className="home-grid">
        <NeedsAttentionList items={attention} error={attentionError} onNavigate={onNavigate} />
        <LiveActivityFeed />
        <QuickActionsCard onNavigate={onNavigate} />
      </div>
    </div>
  )
}
