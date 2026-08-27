import { Button } from '@/components/ui-v2'

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

interface TrySuggestionsProps {
  onPick: (text: string) => void
  submitting: boolean
}

export function TrySuggestions({ onPick, submitting }: TrySuggestionsProps) {
  return (
    <div className="try-row">
      <span className="t-label c-tertiary">Try:</span>
      {SUGGESTIONS.map((s) => (
        <Button key={s.label} variant="secondary" size="xs" disabled={submitting} onClick={() => onPick(s.text)}>
          {s.label}
        </Button>
      ))}
    </div>
  )
}
