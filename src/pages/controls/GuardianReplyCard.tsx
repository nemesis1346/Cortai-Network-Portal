import type { ChangeRecord, TriageResult } from '@/api'
import { stepMark } from './controlsDisplay'
import { useStepRunner } from './useStepRunner'

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
      return (
        <div className="guard show">
          <div className="guard-h">
            <div className="glyph">◈</div>
            <div className="t">AI Guardian</div>
          </div>
          <div className={`dres ${record.diagnosis.tone}`}>{record.diagnosis.verdict}</div>
          <ul className="steps">
            {record.steps.map((s, i) => (
              <li key={i} className={`done${s.state === 'warn' ? ' warnf' : ''}`}>
                <span className="mk">{stepMark(s.state, false)}</span>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          <div className="guard-msg" style={{ marginTop: 6 }} dangerouslySetInnerHTML={{ __html: record.diagnosis.message }} />
          <div className="guard-btns" style={{ marginTop: 10 }}>
            {record.diagnosis.askActions && (
              <>
                <button className="btn primary" onClick={onUnblock}>
                  Unblock for staff VLAN
                </button>
                <button className="btn" onClick={onKeepBlocked}>
                  Keep blocked
                </button>
              </>
            )}
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="guard show">
        <div className="guard-h">
          <div className="glyph">◈</div>
          <div className="t">AI Guardian</div>
        </div>
        <div className="guard-msg guard-done">
          ✓ Done — {triage.intent?.what.toLowerCase() ?? triage.description.toLowerCase()} applied &amp; verified.
          <span className="sub">
            snapshot #{record.snapshot} · rollback available 30 days · logged as #CR-{record.num} — click it in Recent changes
            any time
          </span>
        </div>
        {record.passwordReveal && <PasswordReveal passphrase={record.passwordReveal.passphrase} />}
        <div className="guard-btns" style={{ marginTop: 10 }}>
          <button className="btn" onClick={() => onReverse(record.num)}>
            Roll back
          </button>
          <button className="btn" onClick={() => onViewInLog(record.num)}>
            View log entry
          </button>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    )
  }

  if (triage.intent) {
    const intent = triage.intent
    return (
      <div className="guard show">
        <div className="guard-h">
          <div className="glyph">◈</div>
          <div className="t">
            {triage.tier_label} — {intent.what}
          </div>
        </div>
        <div className="guard-msg" dangerouslySetInnerHTML={{ __html: triage.tier_message_html }} />
        <ul className="steps">
          {intent.plan.map((label, i) => (
            <li key={i} className={stepStates[i] === 'done' ? 'done' : stepStates[i] === 'running' ? 'run' : ''}>
              <span className="mk">{running ? stepMark('pend', stepStates[i] === 'running') : '○'}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        {running ? (
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {intent.isDiagnostic ? 'Investigating — evidence at every step…' : 'Executing — every step verified…'}
          </span>
        ) : (
          <div className="guard-btns">
            <button className="btn primary" onClick={onRun}>
              {intent.primaryButtonLabel}
            </button>
            {intent.isPasswordRotation && (
              <button className="btn" onClick={onSchedule}>
                Schedule for 4:00 AM
              </button>
            )}
            <button className="btn" onClick={onSendToEngineer}>
              Send to an engineer instead
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="guard show">
      <div className="guard-h">
        <div className="glyph">◈</div>
        <div className="t">{triage.tier_label}</div>
      </div>
      <div className="guard-msg">
        <span dangerouslySetInnerHTML={{ __html: triage.tier_message_html }} />
        {triage.fallback_note && ' ' + triage.fallback_note}
      </div>
      <div className="guard-btns">
        <button className="btn primary" onClick={onSendToEngineer}>
          {triage.tier === 4 ? 'Open the work order' : 'Submit to engineering'}
        </button>
      </div>
    </div>
  )
}

function PasswordReveal({ passphrase }: { passphrase: string }) {
  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      <div className="pw-box">
        <span className="pw">{passphrase}</span>
        <button className="btn" onClick={copy}>
          Copy
        </button>
      </div>
      <div className="pw-issue">
        <span className="okm">✓</span>
        <b>Shown once here</b> — retrievable later only by you or the front-desk manager, with the access logged
        <br />
        <span className="okm">✓</span>Texted to the front-desk manager&apos;s phone · printable tent card in the QR
        download
        <br />
        <span className="okm">✓</span>Old passphrase is dead as of now — connected guests rejoin by scanning the new
        QR
        <br />
        <span className="okm">✓</span>Staff network untouched — this changed the guest SSID only
      </div>
    </>
  )
}
