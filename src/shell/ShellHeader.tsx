import { Icon, IconButton } from '@/components/ui-v2'
import { useClock } from '@/hooks/useClock'
import { useTheme } from '@/theme/ThemeProvider'
import { useShellStats } from './useShellStats'

interface ShellHeaderProps {
  title: string
  onOpenAlerts: () => void
  onOpenQuickAction: () => void
}

/** Desktop (≥1280px) topbar — one shared component instead of the prototype's per-page-duplicated block. */
export function ShellHeader({ title, onOpenAlerts, onOpenQuickAction }: ShellHeaderProps) {
  const clock = useClock()
  const stats = useShellStats()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__clock">{clock}</div>
      <div className="topbar__right">
        <div className="topbar__stats">
          <div className="header-stat">
            <div className="header-stat__value">{stats.devices ?? '—'}</div>
            <div className="header-stat__label">Devices</div>
          </div>
          <div className="header-stat">
            <div className="header-stat__value">{stats.throughputMbps ?? '—'} Mbps</div>
            <div className="header-stat__label">Throughput</div>
          </div>
          <div className={`header-stat${stats.alerts ? ' header-stat--danger' : ''}`}>
            <div className="header-stat__value">{stats.alerts ?? '—'}</div>
            <div className="header-stat__label">Alerts</div>
          </div>
        </div>
        <div className="topbar__divider" />
        <div className="topbar__actions">
          <IconButton
            variant={stats.alerts ? 'danger-glyph' : 'default'}
            aria-label="Alerts"
            onClick={onOpenAlerts}
          >
            <Icon name="circle-alert" />
          </IconButton>
          <IconButton variant="default" aria-label="Quick action" onClick={onOpenQuickAction}>
            <Icon name="menu" />
          </IconButton>
          <IconButton variant="default" aria-label="Toggle theme" onClick={toggleTheme}>
            <Icon name={theme === 'light' ? 'moon' : 'sun'} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
