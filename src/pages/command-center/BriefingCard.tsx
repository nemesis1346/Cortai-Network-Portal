import type { Briefing } from '@/api'
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, CardTitle } from '@/components/ui-v2'
import { formatBriefTime } from './commandCenterDisplay'
import { useTypewriter } from './useTypewriter'

interface BriefingCardProps {
  briefing: Briefing | null
  error: string | null
  onNavigate: (tab: string) => void
}

export function BriefingCard({ briefing, error, onNavigate }: BriefingCardProps) {
  const { renderedHtml, done } = useTypewriter(briefing?.narrative_html ?? null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>CORTAI Briefing</CardTitle>
        <span className="spacer" />
        {briefing && <span className="card__sub num">{formatBriefTime(briefing.generated_at)}</span>}
      </CardHeader>
      {error ? (
        <CardBody>
          <Alert variant="danger" title="Briefing unavailable right now" description={error} />
        </CardBody>
      ) : briefing ? (
        <>
          <CardBody className="card__body--scroll">
            <p className="t-body c-secondary" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          </CardBody>
          <CardFooter style={{ opacity: done ? 1 : 0, transition: 'opacity 400ms' }}>
            {briefing.chips.map((chip) => (
              <Button key={chip.label} variant="secondary" size="sm" onClick={() => onNavigate(chip.tab)}>
                {chip.label}
              </Button>
            ))}
          </CardFooter>
        </>
      ) : (
        <CardBody>
          <p className="t-body c-secondary">Loading briefing…</p>
        </CardBody>
      )}
    </Card>
  )
}
