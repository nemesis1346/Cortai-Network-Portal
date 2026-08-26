import { Button } from '@/components/ui-v2'
import { useToast } from '@/components/ui'
import type { ActionDef } from '@/api'

const VARIANT: Record<ActionDef['variant'], 'primary' | 'secondary' | 'danger'> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'danger',
}

export function PanelActions({ actions }: { actions: ActionDef[] }) {
  const { show: showToast } = useToast()
  if (actions.length === 0) return null
  return (
    <div className="net-panel__actions">
      {actions.map((a) => (
        <Button key={a.label} variant={VARIANT[a.variant]} size="sm" onClick={() => showToast(`${a.label} started`)}>
          {a.label}
        </Button>
      ))}
    </div>
  )
}
