import type { AttentionItem } from '@/api'
import { Alert, Card, CardBody, CardHeader, CardTitle, FeedItem, Icon, IconBadge, IconButton } from '@/components/ui-v2'
import { severityIconVariant } from './commandCenterDisplay'

interface NeedsAttentionListProps {
  items: AttentionItem[] | null
  error: string | null
  onNavigate: (tab: string) => void
}

export function NeedsAttentionList({ items, error, onNavigate }: NeedsAttentionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs attention</CardTitle>
      </CardHeader>
      <CardBody>
        {error ? (
          <Alert variant="danger" title="Unavailable right now" description={error} />
        ) : !items ? (
          <p className="t-body-sm c-tertiary">Loading…</p>
        ) : items.length === 0 ? (
          <p className="t-body-sm c-tertiary">Nothing to flag right now.</p>
        ) : (
          <div className="feed">
            {items.map((item) => (
              <FeedItem
                key={item.id}
                onClick={() => onNavigate(item.tab)}
                icon={
                  <IconBadge variant={severityIconVariant(item.severity)} size="sm">
                    <Icon name={item.severity === 'hi' ? 'circle-alert' : 'triangle-alert'} />
                  </IconBadge>
                }
                title={item.title}
                meta={item.detail}
                trailing={
                  <>
                    <span className="feed__time">{item.elapsed}</span>
                    <IconButton
                      variant="default"
                      size="sm"
                      aria-label={`Open in ${item.tab}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigate(item.tab)
                      }}
                    >
                      <Icon name="arrow-right" />
                    </IconButton>
                  </>
                }
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
