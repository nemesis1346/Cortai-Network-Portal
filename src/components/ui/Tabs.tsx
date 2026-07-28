interface TabDef {
  key: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabDef[]
  active: string
  onChange: (key: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 6,
        borderBottom: '1px solid var(--line)',
        marginBottom: 16,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            style={{
              font: 'inherit',
              fontFamily: 'var(--sans)',
              fontSize: 12.5,
              fontWeight: 500,
              padding: '9px 4px',
              marginBottom: -1,
              border: 'none',
              borderBottom: isActive ? '2px solid var(--wired)' : '2px solid transparent',
              background: 'transparent',
              color: isActive ? 'var(--text)' : 'var(--text-2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="mono-num"
                style={{
                  fontSize: 10.5,
                  padding: '1px 6px',
                  borderRadius: 8,
                  background: isActive ? 'rgba(45,212,167,.14)' : 'var(--panel-2)',
                  color: isActive ? 'var(--wired)' : 'var(--text-3)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}