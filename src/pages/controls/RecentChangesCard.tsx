import { useState } from 'react'
import { Alert, Badge, Card, CardBody, CardHeader, CardTitle, Icon, IconBadge, IconButton, Modal } from '@/components/ui-v2'
import { CHANGE_BADGE_LABEL, type ChangeBadge, type ChangeRecord, type GuardTier } from '@/api'

interface RecentChangesCardProps {
  changes: ChangeRecord[] | null
  onOpen: (num: number) => void
}

const TIER_VARIANT: Record<GuardTier, 'accent' | 'info' | 'amber' | 'violet'> = {
  1: 'accent',
  2: 'info',
  3: 'amber',
  4: 'violet',
}

const STATUS_VARIANT: Record<ChangeBadge, 'success' | 'info' | 'amber' | 'danger'> = {
  ai: 'success',
  done: 'success',
  sched: 'amber',
  sub: 'amber',
  can: 'amber',
  rev: 'info',
  blk: 'danger',
}

export function RecentChangesCard({ changes, onOpen }: RecentChangesCardProps) {
  const [infoOpen, setInfoOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent changes</CardTitle>
        <IconButton variant="ghost" size="xs" aria-label="What this means" onClick={() => setInfoOpen(true)}>
          <Icon name="info" />
        </IconButton>
        <span className="spacer" />
      </CardHeader>
      <CardBody>
        {!changes ? (
          <p className="t-body-sm c-tertiary">Loading…</p>
        ) : (
          changes.map((rec) => (
            <button
              key={rec.num}
              type="button"
              className="tr"
              style={{ gridTemplateColumns: '44px 108px minmax(0,1fr)', alignItems: 'center' }}
              onClick={() => onOpen(rec.num)}
            >
              <span className="td" style={{ paddingInlineStart: 'var(--spacing-12)' }}>
                <Badge variant={TIER_VARIANT[rec.tier]} size="sm">
                  T{rec.tier}
                </Badge>
              </span>
              <span className="td">
                <Badge variant={STATUS_VARIANT[rec.badge]} size="sm">
                  {CHANGE_BADGE_LABEL[rec.badge]}
                </Badge>
              </span>
              <span className="td">
                <span className="td__device">
                  <b>{rec.title}</b>
                  <span>
                    {rec.when} · #CR-{rec.num}
                  </span>
                </span>
              </span>
            </button>
          ))
        )}
      </CardBody>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} size="xs" label="Recent changes" bare>
        <Alert
          variant="info"
          icon={
            <IconBadge variant="blue">
              <Icon name="info" />
            </IconBadge>
          }
          title="Recent changes"
          description="Every change — ours or yours — is logged with a tier, a snapshot and a rollback window. Click any row to see what exactly was done and to restore the snapshot."
        />
      </Modal>
    </Card>
  )
}
