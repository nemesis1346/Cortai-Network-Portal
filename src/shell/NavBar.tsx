import { NAV_TABS } from './nav-data'

interface NavBarProps {
  active: string
  onNavigate: (key: string) => void
}

export function NavBar({ active, onNavigate }: NavBarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        gap: 4,
        padding: '0 24px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--panel)',
      }}
    >
      {NAV_TABS.map((tab) => {
        const isBuilt = Boolean(tab.screen)
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            style={{
              font: 'inherit',
              fontFamily: 'var(--sans)',
              fontSize: 13,
              fontWeight: 500,
              padding: '13px 14px',
              marginBottom: -1,
              border: 'none',
              borderBottom: isActive ? '2px solid var(--wired)' : '2px solid transparent',
              background: 'transparent',
              color: isActive ? 'var(--text)' : 'var(--text-2)',
              opacity: isBuilt ? 1 : 0.55,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab.label}
            {!isBuilt && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  color: 'var(--text-3)',
                  border: '1px solid var(--line-2)',
                  borderRadius: 6,
                  padding: '1px 5px',
                }}
              >
                Soon
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}