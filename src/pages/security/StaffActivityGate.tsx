import { Card, Icon, IconBadge } from '@/components/ui-v2'

export function StaffActivityGate() {
  return (
    <Card>
      <div className="table__empty">
        <IconBadge variant="neutral">
          <Icon name="shield" />
        </IconBadge>
        <h4>Staff activity is locked</h4>
        <p>
          Presence and app-usage monitoring requires a written employee monitoring policy before it can be shown —
          Ontario law requires this for workplaces with 25+ employees. This tab unlocks once that policy is in place
          and acknowledged.
        </p>
      </div>
    </Card>
  )
}
