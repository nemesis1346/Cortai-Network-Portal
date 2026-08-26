import type { HomeHealth } from '@/api'
import { Alert, Badge, Card, CardBody, CardHeader, CardTitle, Ring } from '@/components/ui-v2'
import { useCountUp } from '@/hooks/useCountUp'

interface HealthScoreCardProps {
  health: HomeHealth | null
  error: string | null
}

export function HealthScoreCard({ health, error }: HealthScoreCardProps) {
  const score = useCountUp(health?.score ?? null, 1100)

  if (error) {
    return <Alert variant="danger" title="Health status unavailable" description={error} />
  }

  return (
    <Card>
      <span className="card__glow card__glow--success" />
      <CardHeader>
        <CardTitle>Health Score</CardTitle>
      </CardHeader>
      <CardBody fixed className="health">
        <div className="health__ring">
          <Ring value={health?.score ?? 0}>{health ? score : '—'}</Ring>
          <Badge variant="success" dot>
            {health?.status ?? 'Loading…'}
          </Badge>
        </div>
        <p className="health__notes">{health?.contributors.join(' · ') ?? ''}</p>
      </CardBody>
    </Card>
  )
}
