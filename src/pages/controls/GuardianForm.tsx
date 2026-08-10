import { useEffect, useRef, useState } from 'react'
import { useActionLauncher } from '@/shell/ActionLauncherContext'

interface Suggestion {
  label: string
  text: string
}

const SUGGESTIONS: Suggestion[] = [
  { label: 'rotate guest Wi-Fi', text: 'Rotate the guest Wi-Fi password' },
  { label: 'block a site', text: 'Block tiktok.com for staff during business hours' },
  { label: 'employee leaving', text: 'Maria is leaving on Friday — revoke her access' },
  { label: 'open a port', text: 'Open a port for the new PMS server' },
  { label: 'new access point', text: 'Install a new access point in the lobby dead zone' },
  { label: "printer won't print", text: "The back office printer won't print" },
  { label: "can't open a site", text: "I can't open linkedin.com from my desk" },
  { label: 'suspicious email', text: 'Is this email about an unpaid invoice a scam?' },
  { label: 'choppy calls', text: 'Our phone calls sound choppy today' },
  { label: 'weird popups', text: 'The front desk computer is acting weird with popups' },
]

interface GuardianFormProps {
  onTriage: (description: string) => void
  onEmpty: () => void
  submitting: boolean
}

export function GuardianForm({ onTriage, onEmpty, submitting }: GuardianFormProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { guardianPrefill, consumeGuardianPrefill } = useActionLauncher()

  // Action Launcher's "crFrom"-equivalent actions land here — pre-fill only, never auto-submit
  // (that distinction matters: the prefix is incomplete, e.g. "New device to add: ").
  useEffect(() => {
    if (guardianPrefill === null) return
    setText(guardianPrefill)
    consumeGuardianPrefill()
    const el = textareaRef.current
    if (el) {
      el.focus()
      el.setSelectionRange(guardianPrefill.length, guardianPrefill.length)
    }
  }, [guardianPrefill, consumeGuardianPrefill])

  const submit = (value: string) => {
    const v = value.trim()
    if (!v) {
      onEmpty()
      return
    }
    onTriage(v)
  }

  const clickSuggestion = (s: Suggestion) => {
    setText(s.text)
    submit(s.text)
  }

  return (
    <>
      <textarea
        ref={textareaRef}
        className="cr"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe what you need in plain words — the Guardian will tell you which tier it lands on and what happens next"
      />
      <div className="mkc-row">
        <button className="btn primary" disabled={submitting} onClick={() => submit(text)}>
          Triage with Guardian
        </button>
        <div className="sugs">
          <span className="sl">try:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s.label} className="sug" disabled={submitting} onClick={() => clickSuggestion(s)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
