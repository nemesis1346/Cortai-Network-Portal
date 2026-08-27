import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui-v2'
import { useActionLauncher } from '@/shell/ActionLauncherContext'

interface GuardianFormProps {
  text: string
  onTextChange: (value: string) => void
  onTriage: (description: string) => void
  onEmpty: () => void
  submitting: boolean
}

export function GuardianForm({ text, onTextChange, onTriage, onEmpty, submitting }: GuardianFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { guardianPrefill, consumeGuardianPrefill } = useActionLauncher()

  // Action Launcher's "crFrom"-equivalent actions land here — pre-fill only, never auto-submit
  // (that distinction matters: the prefix is incomplete, e.g. "New device to add: ").
  useEffect(() => {
    if (guardianPrefill === null) return
    onTextChange(guardianPrefill)
    consumeGuardianPrefill()
    const el = textareaRef.current
    if (el) {
      el.focus()
      el.setSelectionRange(guardianPrefill.length, guardianPrefill.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardianPrefill, consumeGuardianPrefill])

  const submit = () => {
    const v = text.trim()
    if (!v) {
      onEmpty()
      return
    }
    onTriage(v)
  }

  return (
    <div className="composer">
      <textarea
        ref={textareaRef}
        className="input"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Describe what you need in plain words — the Guardian will tell you which tier it lands on and what happens next"
      />
      <Button variant="primary" disabled={submitting} onClick={submit}>
        Triage with Guardian
      </Button>
    </div>
  )
}
