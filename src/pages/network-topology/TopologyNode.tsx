import type { CSSProperties } from 'react'
import { Badge, Icon } from '@/components/ui-v2'
import type { NodeCardConfig } from './topologyLayout'

interface TopologyNodeProps {
  config: NodeCardConfig
  name: string
  count?: number
  current: boolean
  onClick: () => void
}

export function TopologyNode({ config, name, count, current, onClick }: TopologyNodeProps) {
  const isHub = config.variant === 'hub'
  return (
    <button
      type="button"
      className={`net-node${config.variant ? ` net-node--${config.variant}` : ''}`}
      style={{ '--x': `${config.x}px`, '--y': `${config.y}px`, '--w': `${config.w}px` } as CSSProperties}
      aria-current={current ? 'true' : undefined}
      onClick={onClick}
    >
      {!isHub && <span className="net-node__rail" />}
      <span className="net-node__body">
        {config.kicker && (
          <span className="net-node__kicker">
            {config.kicker}
            <span className="spacer" />
            <Icon name="arrow-up-right" />
          </span>
        )}
        <span className="net-node__name">
          {name}
          {count !== undefined && (
            <>
              <span className="spacer" />
              <span className="net-node__count num">×{count}</span>
            </>
          )}
        </span>
        <span className="net-node__tags">
          {config.tags.map((tag) => (
            <Badge key={tag.label} variant={tag.variant} size="sm">
              {tag.label}
            </Badge>
          ))}
        </span>
      </span>
    </button>
  )
}
