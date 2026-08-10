import { useActionLauncher } from '@/shell/ActionLauncherContext'

interface QuickActionsCardProps {
  onNavigate: (tab: string) => void
}

const ACTIONS = [
  {
    icon: '⟳',
    iconBg: 'rgba(240,86,74,.13)',
    iconColor: 'var(--danger)',
    label: 'Power-cycle CAM-04',
    sub: 'PoE reset on switch port 11',
    openLauncher: false,
  },
  {
    icon: '🔑',
    iconBg: 'rgba(139,124,246,.14)',
    iconColor: 'var(--wireless)',
    label: 'Change guest Wi-Fi password',
    sub: 'most common request — 30 seconds',
    openLauncher: true,
  },
  {
    icon: '👥',
    iconBg: 'rgba(224,164,88,.14)',
    iconColor: 'var(--iot)',
    label: 'Onboard / offboard someone',
    sub: 'guided — devices, Wi-Fi & access in one flow',
    openLauncher: true,
  },
]

export function QuickActionsCard({ onNavigate }: QuickActionsCardProps) {
  const { open: openLauncher } = useActionLauncher()

  return (
    <div className="card">
      <h3>Quick actions</h3>
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          className="qa-btn"
          onClick={() => (action.openLauncher ? openLauncher() : onNavigate('controls'))}
        >
          <span className="ic" style={{ background: action.iconBg, color: action.iconColor }}>
            {action.icon}
          </span>
          <span>
            {action.label}
            <span className="sub">{action.sub}</span>
          </span>
        </button>
      ))}
      <button
        className="qa-btn"
        style={{ borderColor: 'var(--wired)', background: 'rgba(45,212,167,.06)' }}
        onClick={openLauncher}
      >
        <span className="ic" style={{ background: 'rgba(45,212,167,.13)', color: 'var(--ok)' }}>
          ⌘
        </span>
        <span>
          <b>Browse all actions</b>
          <span className="sub">the 20 things you'd otherwise call us for</span>
        </span>
      </button>
    </div>
  )
}
