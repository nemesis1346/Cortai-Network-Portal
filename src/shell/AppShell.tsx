import { useState, type ComponentType } from 'react'
import { EmptyState } from '@/components/ui'
import { DevicesAwaitingTable } from '@/pages/devices-awaiting/DevicesAwaitingTable'
import { NAV_TABS } from './nav-data'
import { NavBar } from './NavBar'
import { TopBar } from './TopBar'

const SCREENS: Record<string, ComponentType> = {
  'devices-awaiting': DevicesAwaitingTable,
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState<string>('network')

  const tab = NAV_TABS.find((t) => t.key === activeTab) ?? NAV_TABS[0]
  const Screen = tab.screen ? SCREENS[tab.screen] : undefined

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <NavBar active={activeTab} onNavigate={setActiveTab} />
      <main style={{ flex: 1, padding: 24 }}>
        {Screen ? (
          <Screen />
        ) : (
          <EmptyState
            icon="⏳"
            title={`${tab.label} — coming soon`}
            sub="This module hasn't been built yet."
          />
        )}
      </main>
    </div>
  )
}