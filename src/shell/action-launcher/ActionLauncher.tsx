import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/ui'
import { Badge, Chip, Icon, IconBadge, IconButton, Modal, ModalBody, ModalFoot, ModalHead, ModalSub, ModalTitle } from '@/components/ui-v2'
import { useActionLauncher } from '@/shell/ActionLauncherContext'
import { ACTIONS, type ActionEffect, type ActionItem } from './actionsData'
import './action-launcher.css'

const TIER_BADGE_LABEL: Record<ActionItem['tierBadge'], string> = {
  inst: 'AI GUARDIAN',
  guid: 'AI + YOUR OK',
  eng: 'ENGINEER',
}

const TIER_BADGE_VARIANT: Record<ActionItem['tierBadge'], 'success' | 'violet' | 'amber'> = {
  inst: 'success',
  guid: 'violet',
  eng: 'amber',
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
    return () => clearTimeout(timer)
  }, [isOpen])

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
    <Modal open={isOpen} onClose={handleClose} size="lg" label="What do you need to do?">
      <ModalHead>
        <div>
          <ModalTitle>What do you need to do?</ModalTitle>
          <ModalSub>20 common actions, no hold music</ModalSub>
        </div>
        <div className="spacer" />
        <IconButton variant="ghost" size="sm" aria-label="Close" onClick={handleClose}>
          <Icon name="x" />
        </IconButton>
      </ModalHead>

      <input
        ref={searchRef}
        className="qa-search"
        placeholder="Search — try 'wifi', 'new employee', 'vendor', 'slow'…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="qa-cats">
        {categories.map((c) => (
          <Chip key={c} size="sm" pressed={c === activeCategory} onClick={() => setActiveCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <ModalBody>
        {filtered.length === 0 ? (
          <div className="qa-empty">
            Nothing matches &quot;{search}&quot; — describe it as a change request in Controls and an engineer will
            pick it up.
          </div>
        ) : (
          groupedCategories.map((cat) => (
            <div key={cat}>
              <div className="qa-cat-label">{cat}</div>
              <div className="qa-grid">
                {filtered
                  .filter((a) => a.category === cat)
                  .map((a) => (
                    <button key={a.id} className="qa-tile" onClick={() => runEffect(a.effect)}>
                      <IconBadge variant="neutral" size="sm">
                        <span style={{ fontSize: 14 }}>{a.icon}</span>
                      </IconBadge>
                      <span className="qa-tile__text">
                        <span className="qa-tile__title">{a.title}</span>
                        <span className="qa-tile__desc">{a.description}</span>
                      </span>
                      <Badge variant={TIER_BADGE_VARIANT[a.tierBadge]} size="sm">
                        {TIER_BADGE_LABEL[a.tierBadge]}
                      </Badge>
                    </button>
                  ))}
              </div>
            </div>
          ))
        )}
      </ModalBody>

      <ModalFoot>
        <div className="qa-legend">
          <span className="qa-legend__item">
            <Badge variant="success" size="sm">
              AI GUARDIAN
            </Badge>
            done autonomously — snapshot, verify, auto-rollback
          </span>
          <span className="qa-legend__item">
            <Badge variant="violet" size="sm">
              AI + YOUR OK
            </Badge>
            Guardian executes after your one-tap approval
          </span>
          <span className="qa-legend__item">
            <Badge variant="amber" size="sm">
              ENGINEER
            </Badge>
            Guardian preps the plan, a human reviews &amp; applies
          </span>
        </div>
      </ModalFoot>
    </Modal>
  )
}
