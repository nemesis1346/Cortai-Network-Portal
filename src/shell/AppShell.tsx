import { useState, type ComponentType } from 'react'
import { IconSprite } from '@/components/ui-v2/IconSprite'
import { CommandCenter } from '@/pages/command-center/CommandCenter'
import { Controls } from '@/pages/controls/Controls'
import { Insights } from '@/pages/insights/Insights'
import { MonthlyReport } from '@/pages/monthly-report/MonthlyReport'
import { NetworkPage } from '@/pages/network/NetworkPage'
import { SecurityCenter } from '@/pages/security/SecurityCenter'
import { WanHealth } from '@/pages/wan-health/WanHealth'
import { ActionLauncher } from './action-launcher/ActionLauncher'
import { QuickActionModal } from './action-launcher/QuickActionModal'
import { AlertsModal } from './AlertsModal'
import { AppBar } from './AppBar'
import { MobileNavbar } from './MobileNavbar'
import { NAV_TABS, type ScreenProps } from './nav-data'
import { ShellHeader } from './ShellHeader'
import { Sidebar } from './Sidebar'
import { useShellStats } from './useShellStats'

const SCREENS: Record<string, ComponentType<ScreenProps>> = {
  network: NetworkPage,
  'command-center': CommandCenter,
  controls: Controls,
  security: SecurityCenter,
  insights: Insights,
  'wan-health': WanHealth,
  'monthly-report': MonthlyReport,
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState<string>('command-center')
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [quickActionOpen, setQuickActionOpen] = useState(false)
  const stats = useShellStats()

  const tab = NAV_TABS.find((t) => t.key === activeTab) ?? NAV_TABS[0]
  const Screen = SCREENS[tab.screen]

  return (
    <div className="app">
      <IconSprite />
      <div className="app-glow" />
      <Sidebar active={activeTab} onNavigate={setActiveTab} />
      <div className="app-main">
        <AppBar
          onOpenAlerts={() => setAlertsOpen(true)}
          onOpenQuickAction={() => setQuickActionOpen(true)}
          alertsCount={stats.alerts}
        />
        <MobileNavbar active={activeTab} onNavigate={setActiveTab} />
        <ShellHeader
          title={tab.label}
          onOpenAlerts={() => setAlertsOpen(true)}
          onOpenQuickAction={() => setQuickActionOpen(true)}
        />
        <main className="page v2-scrollbars">
          <Screen onNavigate={setActiveTab} />
        </main>
      </div>
      <AlertsModal open={alertsOpen} onClose={() => setAlertsOpen(false)} onNavigate={setActiveTab} />
      <QuickActionModal open={quickActionOpen} onClose={() => setQuickActionOpen(false)} onNavigate={setActiveTab} />
      <ActionLauncher onNavigate={setActiveTab} />
    </div>
  )
}
