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
    <div className="tabs" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className="tab"
            onClick={() => onChange(tab.key)}
          >
            <span className="tab__row">
              {tab.label}
              {tab.count !== undefined && (
                <span className={`badge badge--sm ${isActive ? 'badge--accent' : 'badge--neutral'}`}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
