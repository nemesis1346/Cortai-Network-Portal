import { useState, type ComponentType } from 'react'
import { EmptyState } from '@/components/ui'
import { CommandCenter } from '@/pages/command-center/CommandCenter'
import { Controls } from '@/pages/controls/Controls'
import { DevicesAwaitingTable } from '@/pages/devices-awaiting/DevicesAwaitingTable'
import { Insights } from '@/pages/insights/Insights'
import { SecurityCenter } from '@/pages/security/SecurityCenter'
import { ActionLauncher } from './action-launcher/ActionLauncher'
import { NAV_TABS, type ScreenProps } from './nav-data'
import { NavBar } from './NavBar'
import { TopBar } from './TopBar'

const SCREENS: Record<string, ComponentType<ScreenProps>> = {
  'devices-awaiting': DevicesAwaitingTable,
  'command-center': CommandCenter,
  controls: Controls,
  security: SecurityCenter,
  insights: Insights,
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState<string>('command-center')

  const tab = NAV_TABS.find((t) => t.key === activeTab) ?? NAV_TABS[0]
  const Screen = tab.screen ? SCREENS[tab.screen] : undefined

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <NavBar active={activeTab} onNavigate={setActiveTab} />
      <main style={{ flex: 1, padding: 24 }}>
        {Screen ? (
          <Screen onNavigate={setActiveTab} />
        ) : (
          <EmptyState
            icon="⏳"
            title={`${tab.label} — coming soon`}
            sub="This module hasn't been built yet."
          />
        )}
      </main>
      <ActionLauncher onNavigate={setActiveTab} />
    </div>
  )
}