import { Icon } from './Icon'
import { IconBadge } from './IconBadge'

interface UnavailableProps {
  title: string
  reason: string
  icon?: string
}

export function Unavailable({ title, reason, icon = 'unlink' }: UnavailableProps) {
  return (
    <div className="table__empty">
      <IconBadge variant="neutral">
        <Icon name={icon} />
      </IconBadge>
      <h4>{title}</h4>
      <p>{reason}</p>
    </div>
  )
}
