import { Chip, Icon } from '@/components/ui-v2'
import { NAV_TABS } from './nav-data'

interface MobileNavbarProps {
  active: string
  onNavigate: (key: string) => void
}

/** Tablet/mobile (<1280px) section strip — replaces the sidebar's nav list. */
export function MobileNavbar({ active, onNavigate }: MobileNavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar__scroll">
        {NAV_TABS.map((tab) => (
          <Chip
            key={tab.key}
            className="chip--nav"
            pressed={tab.key === active}
            aria-current={tab.key === active ? 'page' : undefined}
            aria-disabled={!tab.screen || undefined}
            onClick={() => onNavigate(tab.key)}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </Chip>
        ))}
      </div>
    </nav>
  )
}
