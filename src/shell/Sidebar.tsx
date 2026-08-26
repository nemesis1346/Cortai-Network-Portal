import { Icon } from '@/components/ui-v2'
import { useTheme } from '@/theme/ThemeProvider'
import { NAV_TABS } from './nav-data'

interface SidebarProps {
  active: string
  onNavigate: (key: string) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const { theme } = useTheme()

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand__mark">
            <span>
              <Icon name="activity" />
            </span>
          </div>
          <div className="brand__text">
            <div className="brand__name">CORTAI</div>
            <div className="brand__sub">Network Ops</div>
          </div>
        </div>
        <nav className="nav">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className="nav-item"
              aria-current={tab.key === active ? 'page' : undefined}
              aria-disabled={!tab.screen || undefined}
              onClick={() => onNavigate(tab.key)}
            >
              <Icon name={tab.icon} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="sidebar__footer">
        <p>TownePlace Suites Vaughan — Main LAN</p>
        <p>Monitored 24/7 by COrtai NOC · {theme === 'light' ? 'Arctic' : 'Nocturne'}</p>
      </div>
    </aside>
  )
}
