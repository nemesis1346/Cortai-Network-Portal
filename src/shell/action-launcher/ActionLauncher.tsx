import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/ui'
import { useActionLauncher } from '@/shell/ActionLauncherContext'
import { ACTIONS, type ActionEffect, type ActionItem } from './actionsData'
import './action-launcher.css'

const TIER_BADGE_LABEL: Record<ActionItem['tierBadge'], string> = {
  inst: 'AI GUARDIAN',
  guid: 'AI + YOUR OK',
  eng: 'ENGINEER',
}

interface ActionLauncherProps {
  onNavigate: (tab: string) => void
}

export function ActionLauncher({ onNavigate }: ActionLauncherProps) {
  const { isOpen, close, requestGuardianPrefill, requestFocusBlockInput } = useActionLauncher()
  const { show: showToast } = useToast()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => searchRef.current?.focus(), 80)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    close()
    setSearch('')
    setActiveCategory('All')
  }

  const runEffect = (effect: ActionEffect) => {
    switch (effect.kind) {
      case 'toast':
        handleClose()
        showToast(effect.message)
        break
      case 'navigate':
        handleClose()
        onNavigate(effect.tab)
        if (effect.message) showToast(effect.message)
        break
      case 'navigate-focus-block':
        handleClose()
        onNavigate('controls')
        requestFocusBlockInput()
        break
      case 'guardian-prefill':
        handleClose()
        onNavigate('controls')
        requestGuardianPrefill(effect.prefix)
        showToast('Fill in the details — engineer review within 1 business hour')
        break
    }
  }

  const categories = ['All', ...new Set(ACTIONS.map((a) => a.category))]
  const q = search.trim().toLowerCase()
  const filtered = ACTIONS.filter(
    (a) =>
      (activeCategory === 'All' || a.category === activeCategory) &&
      (!q || `${a.title} ${a.description} ${a.keywords}`.toLowerCase().includes(q)),
  )
  const groupedCategories = [...new Set(filtered.map((a) => a.category))]

  return (
    <div
      className="ov open"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="acts" role="dialog" aria-modal="true" aria-label="What do you need to do?">
        <div className="acts-head">
          <div className="row1">
            <div className="ttl">What do you need to do?</div>
            <div className="sub">20 common actions, no hold music</div>
            <button
              className="btn"
              style={{ position: 'static', marginLeft: 'auto', padding: '6px 10px' }}
              onClick={handleClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <input
            ref={searchRef}
            className="acts-search"
            placeholder="Search — try 'wifi', 'new employee', 'vendor', 'slow'…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="acts-cats">
            {categories.map((c) => (
              <button key={c} className={c === activeCategory ? 'on' : ''} onClick={() => setActiveCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="acts-body">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 13, padding: '30px 10px' }}>
              Nothing matches &quot;{search}&quot; — describe it as a change request in Controls and an engineer will
              pick it up.
            </div>
          ) : (
            groupedCategories.map((cat) => (
              <div key={cat}>
                <div className="acts-cat-lab">{cat}</div>
                <div className="acts-grid">
                  {filtered
                    .filter((a) => a.category === cat)
                    .map((a) => (
                      <button key={a.id} className="act" onClick={() => runEffect(a.effect)}>
                        <span className="ic" style={{ background: `${a.color}1f`, color: a.color }}>
                          {a.icon}
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <span className="t">{a.title}</span>
                          <span className="d" style={{ display: 'block' }}>
                            {a.description}
                          </span>
                        </span>
                        <span className={`bd ${a.tierBadge}`}>{TIER_BADGE_LABEL[a.tierBadge]}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="acts-foot">
          <span>
            <span className="bd inst" style={{ marginRight: 5 }}>
              AI GUARDIAN
            </span>
            done autonomously — snapshot, verify, auto-rollback
          </span>
          <span>
            <span className="bd guid" style={{ marginRight: 5 }}>
              AI + YOUR OK
            </span>
            Guardian executes after your one-tap approval
          </span>
          <span>
            <span className="bd eng" style={{ marginRight: 5 }}>
              ENGINEER
            </span>
            Guardian preps the plan, a human reviews &amp; applies
          </span>
        </div>
      </div>
    </div>
  )
}
