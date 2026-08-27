import type { MouseEvent } from 'react'
import { Alert, Badge, Button, Card, Checklist, Icon, type ChecklistItem } from '@/components/ui-v2'
import type { ChangeRecord, ChangeStep, GuardTier, TriageResult } from '@/api'
import { useStepRunner } from '@/hooks/useStepRunner'

interface GuardianReplyCardProps {
  triage: TriageResult
  running: boolean
  record: ChangeRecord | null
  onRun: () => void
  onSchedule: () => void
  onSendToEngineer: () => void
  onUnblock: () => void
  onKeepBlocked: () => void
  onReverse: (num: number) => void
  onViewInLog: (num: number) => void
  onClose: () => void
}

const TIER_BORDER: Record<GuardTier, string> = {
  1: 'var(--color-accent-default)',
  2: 'var(--color-status-info)',
  3: 'var(--color-status-warning)',
  4: 'var(--color-badge-violet)',
}

const DIAGNOSIS_TONE_BORDER: Record<'ok' | 'ask' | 'esc', string> = {
  ok: 'var(--color-status-success)',
  ask: 'var(--color-status-warning)',
  esc: 'var(--color-status-danger)',
}

const DIAGNOSIS_TONE_ALERT: Record<'ok' | 'ask' | 'esc', 'success' | 'warning' | 'danger'> = {
  ok: 'success',
  ask: 'warning',
  esc: 'danger',
}

const CHANGE_STEP_STATE: Record<ChangeStep['state'], ChecklistItem['state']> = {
  ok: 'done',
  warn: 'warn',
  pend: 'pending',
}

export function GuardianReplyCard({
  triage,
  running,
  record,
  onRun,
  onSchedule,
  onSendToEngineer,
  onUnblock,
  onKeepBlocked,
  onReverse,
  onViewInLog,
  onClose,
}: GuardianReplyCardProps) {
  const planLabels = triage.intent?.plan ?? []
  const stepStates = useStepRunner(running ? planLabels.length : 0)

  if (record) {
    if (record.diagnosis) {
      const tone = record.diagnosis.tone
      return (
        <Card style={{ borderColor: DIAGNOSIS_TONE_BORDER[tone] }}>
          <Alert
            variant={DIAGNOSIS_TONE_ALERT[tone]}
            title={record.diagnosis.verdict}
            description={<span dangerouslySetInnerHTML={{ __html: record.diagnosis.message }} />}
          />
          <Checklist items={record.steps.map((s) => ({ label: s.label, state: CHANGE_STEP_STATE[s.state] }))} />
          <div className="card__footer">
            {record.diagnosis.askActions && (
              <>
                <Button variant="primary" size="sm" onClick={onUnblock}>
                  Unblock for staff VLAN
                </Button>
                <Button variant="secondary" size="sm" onClick={onKeepBlocked}>
                  Keep blocked
                </Button>
              </>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <Card style={{ borderColor: 'var(--color-accent-default)' }}>
        <p className="t-h4 c-accent">AI Guardian</p>
        <Checklist
          items={[
            {
              label: `Done — ${(triage.intent?.what ?? triage.description).toLowerCase()} applied & verified.`,
              state: 'done',
            },
          ]}
        />
        <p className="t-label c-tertiary">
          snapshot #{record.snapshot} · rollback available 30 days · logged as #CR-{record.num} — click it in Recent
          changes any time
        </p>
        {record.passwordReveal && <PasswordReveal passphrase={record.passwordReveal.passphrase} />}
        <div className="card__footer">
          <Button variant="secondary" size="sm" onClick={() => onReverse(record.num)}>
            Roll back
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onViewInLog(record.num)}>
            View log entry
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    )
  }

  if (triage.intent) {
    const intent = triage.intent
    return (
      <Card style={{ borderColor: TIER_BORDER[triage.tier] }}>
        <p className="t-h4 c-accent">
          {triage.tier_label} — {intent.what}
        </p>
        <p className="t-body-sm c-tertiary" dangerouslySetInnerHTML={{ __html: triage.tier_message_html }} />
        <Checklist
          items={intent.plan.map((label, i) => ({
            label,
            state: running ? (stepStates[i] ?? 'pending') : 'pending',
          }))}
        />
        {running ? (
          <Badge variant="info" dot live>
            {intent.isDiagnostic ? 'Investigating — evidence at every step…' : 'Executing — every step verified…'}
          </Badge>
        ) : (
          <div className="card__footer">
            <Button variant="primary" size="sm" onClick={onRun}>
              {intent.primaryButtonLabel}
            </Button>
            {intent.isPasswordRotation && (
              <Button variant="secondary" size="sm" onClick={onSchedule}>
                Schedule for 4:00 AM
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onSendToEngineer}>
              Send to an engineer instead
            </Button>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card style={{ borderColor: TIER_BORDER[triage.tier] }}>
      <p className="t-h4 c-accent">{triage.tier_label}</p>
      <p className="t-body-sm c-tertiary">
        <span dangerouslySetInnerHTML={{ __html: triage.tier_message_html }} />
        {triage.fallback_note && ' ' + triage.fallback_note}
      </p>
      <div className="card__footer">
        <Button variant="primary" size="sm" onClick={onSendToEngineer}>
          {triage.tier === 4 ? 'Open the work order' : 'Submit to engineering'}
        </Button>
      </div>
    </Card>
  )
}

function PasswordReveal({ passphrase }: { passphrase: string }) {
  const copy = async (e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    try {
      await navigator.clipboard.writeText(passphrase)
      btn.textContent = 'Copied ✓'
    } catch {
      btn.textContent = `Select and copy: ${passphrase}`
    }
  }
  return (
    <>
      <div
        className="card card--plain"
        style={{
          border: '1px solid var(--color-accent-default)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-16)',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 'var(--spacing-12)',
        }}
      >
        <b className="t-h3 c-accent" style={{ flex: 1 }}>
          {passphrase}
        </b>
        <Button variant="secondary" size="sm" onClick={copy}>
          Copy
        </Button>
        <Button variant="secondary" size="sm">
          <Icon name="qr-code" /> QR poster
        </Button>
      </div>
      <Checklist
        items={[
          { label: 'Shown once here — retrievable later only by you or the front-desk manager, with the access logged', state: 'done' },
          { label: "Texted to the front-desk manager's phone · printable tent card in the QR download", state: 'done' },
          { label: 'Old passphrase is dead as of now — connected guests rejoin by scanning the new QR', state: 'done' },
          { label: 'Staff network untouched — this changed the guest SSID only', state: 'done' },
        ]}
      />
    </>
  )
}
