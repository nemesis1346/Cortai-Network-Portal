import { useEffect, useState } from 'react'
import { homeApi, type AttentionItem, type Briefing, type HomeHealth, type HomeKpis } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { AwaitingMiniCard } from './AwaitingMiniCard'
import { BriefingCard } from './BriefingCard'
import { HealthScoreCard } from './HealthScoreCard'
import { ImpactBanner } from './ImpactBanner'
import { LiveActivityFeed } from './LiveActivityFeed'
import { NeedsAttentionList } from './NeedsAttentionList'
import { SectionLinksGrid } from './SectionLinksGrid'

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
    <>
      <section className="row" style={{ gridTemplateColumns: '370fr 600fr 600fr', flex: '288 1 0', minBlockSize: 288 }}>
        <HealthScoreCard health={health} error={healthError} />
        <BriefingCard briefing={briefing} error={briefingError} onNavigate={onNavigate} />
        <ImpactBanner kpis={kpis} error={kpisError} />
      </section>

      <section className="row" style={{ gridTemplateColumns: '608.5fr 981.5fr', flex: '272 1 0', minBlockSize: 272 }}>
        <SectionLinksGrid health={health} error={healthError} onNavigate={onNavigate} />
        <AwaitingMiniCard onNavigate={onNavigate} />
      </section>

      <section className="row" style={{ gridTemplateColumns: '1fr 1fr', flex: '388 1 0', minBlockSize: 340 }}>
        <NeedsAttentionList items={attention} error={attentionError} onNavigate={onNavigate} />
        <LiveActivityFeed />
      </section>
    </>
  )
}
