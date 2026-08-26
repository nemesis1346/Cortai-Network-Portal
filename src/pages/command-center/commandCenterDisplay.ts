import type { AttentionSeverity } from '@/api'

export function severityIconVariant(severity: AttentionSeverity): 'red' | 'amber' {
  return severity === 'hi' ? 'red' : 'amber'
}

export function formatEventTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleTimeString('en-CA', { hour12: false })
}

export function formatBriefTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return (
    date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' · ' +
    date.toLocaleTimeString('en-CA', { hour12: false })
  )
}
