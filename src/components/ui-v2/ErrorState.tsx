import { Icon } from './Icon'
import { IconBadge } from './IconBadge'

interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="table__empty">
      <IconBadge variant="red">
        <Icon name="alert-triangle" />
      </IconBadge>
      <p className="c-danger">{message}</p>
    </div>
  )
}
