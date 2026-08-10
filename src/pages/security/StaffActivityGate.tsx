import { EmptyState } from '@/components/ui'

export function StaffActivityGate() {
  return (
    <div className="card">
      <EmptyState
        icon="⛨"
        title="Staff activity is locked"
        sub="Presence and app-usage monitoring requires a written employee monitoring policy before it can be shown — Ontario law requires this for workplaces with 25+ employees. This tab unlocks once that policy is in place and acknowledged."
      />
    </div>
  )
}
