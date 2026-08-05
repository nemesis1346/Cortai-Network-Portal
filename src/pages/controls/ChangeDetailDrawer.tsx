import { Drawer } from '@/components/ui'
import type { ChangeRecord, ReverseKind } from '@/api'
import { badgeVisual, stepMark, tierTagVisual } from './controlsDisplay'

const REVERSE_LABEL: Record<ReverseKind, string> = {
  snapshot: 'Reverse this change — restore snapshot',
  cancel: 'Cancel this scheduled change',
  reblock: 'Reverse — re-block the site',
}

interface ChangeDetailDrawerProps {
  record: ChangeRecord | null
  onClose: () => void
  onReverse: (num: number) => void
}

export function ChangeDetailDrawer({ record, onClose, onReverse }: ChangeDetailDrawerProps) {
  if (!record) return null
  const badge = badgeVisual(record.badge)
  const tierTag = tierTagVisual(record.tier)

  return (
    <Drawer open={Boolean(record)} onClose={onClose} icon="◈" title={`#CR-${record.num} — ${record.title}`} subtitle={record.when}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14, flexWrap: 'wrap' }}>
        <span className="tch" style={{ color: tierTag.color, background: tierTag.bg }}>
          TIER {record.tier}
        </span>
        <span className="st2" style={{ color: badge.color, background: badge.bg }}>
          {badge.label}
        </span>
        <span className="crm-when">{record.when}</span>
      </div>

      <div className="kv">
        <div className="cell">
          <div className="k">Executed by</div>
          <div className="v">{record.executor}</div>
        </div>
        <div className="cell">
          <div className="k">Approved by</div>
          <div className="v">{record.approved}</div>
        </div>
        <div className="cell">
          <div className="k">Snapshot</div>
          <div className="v">{record.snapshot}</div>
        </div>
        <div className="cell">
          <div className="k">Rollback window</div>
          <div className="v">{record.reversible ? '30 days — available' : '—'}</div>
        </div>
      </div>

      <div className="crm-sec">Why (Guardian rationale)</div>
      <div className="gsug">◈ {record.rationale}</div>

      <div className="crm-sec">What was done</div>
      <ul className="steps">
        {record.steps.map((s, i) => (
          <li key={i} className={s.state !== 'pend' ? `done${s.state === 'warn' ? ' warnf' : ''}` : ''}>
            <span className="mk">{stepMark(s.state, false)}</span>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="crm-sec">Verification</div>
      <ul className="steps">
        {record.verify.map((v, i) => (
          <li key={i} className="done">
            <span className="mk">✓</span>
            <span>{v}</span>
          </li>
        ))}
      </ul>

      <div className="guard-btns" style={{ marginTop: 14 }}>
        {record.reversible && (
          <button className="btn danger" onClick={() => onReverse(record.num)}>
            {REVERSE_LABEL[record.rkind ?? 'snapshot']}
          </button>
        )}
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
      {!record.reversible && record.revNote && <div className="crm-rev-note">{record.revNote}</div>}
      {record.reversible && <div className="crm-rev-note">Reversal is itself a logged change: snapshot restored (or action undone), verified after, attributed to you.</div>}
    </Drawer>
  )
}
