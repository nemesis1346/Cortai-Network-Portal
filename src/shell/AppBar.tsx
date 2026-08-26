import { Avatar, Icon, IconButton } from '@/components/ui-v2'
import { useTheme } from '@/theme/ThemeProvider'

interface AppBarProps {
  onOpenAlerts: () => void
  onOpenQuickAction: () => void
  alertsCount: number | null
}

/** Tablet/mobile (<1280px) — replaces the sidebar; renders below via CSS media query. */
export function AppBar({ onOpenAlerts, onOpenQuickAction, alertsCount }: AppBarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="appbar">
      <div className="appbar__brand">
        <div className="brand__mark">
          <span>
            <Icon name="activity" />
          </span>
        </div>
        <div className="appbar__text">
          <div className="brand__name">CORTAI</div>
          <div className="brand__sub">Network Ops</div>
        </div>
      </div>
      <div className="spacer" />
      <div className="appbar__actions">
        <IconButton
          variant={alertsCount ? 'danger-glyph' : 'default'}
          size="sm"
          aria-label="Alerts"
          onClick={onOpenAlerts}
        >
          <Icon name="circle-alert" />
        </IconButton>
        <IconButton variant="default" size="sm" aria-label="Quick action" onClick={onOpenQuickAction}>
          <Icon name="menu" />
        </IconButton>
        <IconButton variant="default" size="sm" aria-label="Toggle theme" onClick={toggleTheme}>
          <Icon name={theme === 'light' ? 'moon' : 'sun'} />
        </IconButton>
        <Avatar initials="JD" name="Jordan Diaz" size="md" />
      </div>
    </header>
  )
}
