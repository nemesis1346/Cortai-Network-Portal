import type { AttentionItem } from '@/api'
import { severityColor } from './commandCenterDisplay'

interface NeedsAttentionListProps {
  items: AttentionItem[] | null
  error: string | null
  onNavigate: (tab: string) => void
}

export function NeedsAttentionList({ items, error, onNavigate }: NeedsAttentionListProps) {
  return (
    <div className="card">
      <h3>Needs attention</h3>
      {error ? (
        <div className="degraded">Unavailable right now — {error}</div>
      ) : !items ? (
        <div className="text-3">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-3">Nothing to flag right now.</div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="alert-item" onClick={() => onNavigate(item.tab)}>
            <div className="sev" style={{ background: severityColor(item.severity) }} />
            <div>
              <div className="t1">{item.title}</div>
              <div className="t2">{item.detail}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
