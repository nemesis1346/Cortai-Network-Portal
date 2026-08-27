import {
  Badge,
  Button,
  Checklist,
  Icon,
  IconBadge,
  IconButton,
  Modal,
  ModalBody,
  ModalFoot,
  ModalHead,
  ModalRule,
  ModalSub,
  ModalTitle,
} from '@/components/ui-v2'
import type { ChangeRecord, ChangeStep, ReverseKind } from '@/api'

const REVERSE_LABEL: Record<ReverseKind, string> = {
  snapshot: 'Reverse this change — restore snapshot',
  cancel: 'Cancel this scheduled change',
  reblock: 'Reverse — re-block the site',
}

const STEP_STATE: Record<ChangeStep['state'], 'pending' | 'done' | 'warn'> = {
  ok: 'done',
  warn: 'warn',
  pend: 'pending',
}

interface ChangeDetailModalProps {
  record: ChangeRecord | null
  onClose: () => void
  onReverse: (num: number) => void
}

export function ChangeDetailModal({ record, onClose, onReverse }: ChangeDetailModalProps) {
  return (
    <Modal open={Boolean(record)} onClose={onClose} label={record ? `#CR-${record.num} — ${record.title}` : 'Change detail'}>
      {record && (
        <>
          <ModalHead>
            <IconBadge variant="violet">
              <Icon name="settings" />
            </IconBadge>
            <div>
              <ModalTitle>
                #CR-{record.num} — {record.title}
              </ModalTitle>
              <ModalSub>{record.when}</ModalSub>
            </div>
            <span className="spacer" />
            <IconButton variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
              <Icon name="x" />
            </IconButton>
          </ModalHead>
          <ModalRule />

          <ModalBody>
            <div style={{ display: 'flex', gap: 'var(--spacing-8)' }}>
              <Badge variant="success" size="sm">
                T{record.tier}
              </Badge>
            </div>

            <dl className="spec">
              <div>
                <dt>Executed by</dt>
                <dd>{record.executor}</dd>
              </div>
              <div>
                <dt>Approved by</dt>
                <dd>{record.approved}</dd>
              </div>
              <div>
                <dt>Snapshot</dt>
                <dd>{record.snapshot}</dd>
              </div>
              <div>
                <dt>Rollback window</dt>
                <dd>{record.reversible ? '30 days — available' : '—'}</dd>
              </div>
            </dl>

            <p className="section-title">Why (Guardian rationale)</p>
            <div className="card card--plain" style={{ flexDirection: 'row', gap: 'var(--spacing-12)', padding: 'var(--spacing-16)' }}>
              <IconBadge variant="green" size="sm">
                <Icon name="activity" />
              </IconBadge>
              <p className="t-body-sm c-secondary">{record.rationale}</p>
            </div>

            <p className="section-title">What was done</p>
            <Checklist items={record.steps.map((s) => ({ label: s.label, state: STEP_STATE[s.state] }))} />

            <p className="section-title">Verification</p>
            <Checklist items={record.verify.map((label) => ({ label, state: 'done' as const }))} />
          </ModalBody>

          <ModalFoot style={{ flexWrap: 'wrap' }}>
            {record.reversible && (
              <Button variant="danger" size="sm" onClick={() => onReverse(record.num)}>
                {REVERSE_LABEL[record.rkind ?? 'snapshot']}
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            {!record.reversible && record.revNote && (
              <p className="t-label c-tertiary" style={{ flexBasis: '100%' }}>
                {record.revNote}
              </p>
            )}
            {record.reversible && (
              <p className="t-label c-tertiary" style={{ flexBasis: '100%' }}>
                Reversal is itself a logged change: snapshot restored (or action undone), verified after, attributed
                to you.
              </p>
            )}
          </ModalFoot>
        </>
      )}
    </Modal>
  )
}
