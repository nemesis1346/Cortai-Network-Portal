import { Icon } from './Icon'

export interface ChecklistItem {
  label: string
  state: 'pending' | 'running' | 'done' | 'warn'
}

const DATA_STATE: Record<ChecklistItem['state'], string | undefined> = {
  pending: undefined,
  running: 'run',
  done: 'done',
  warn: 'warn',
}

export function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <div className="checklist">
      {items.map((item, i) => (
        <div key={i} data-state={DATA_STATE[item.state]}>
          {item.state === 'running' ? <span className="spinner" /> : item.state === 'pending' ? <i /> : <Icon name="check" />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
