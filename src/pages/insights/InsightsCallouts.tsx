import { Badge } from '@/components/ui-v2'

interface InsightsCalloutsProps {
  callouts: string[] | null
}

export function InsightsCallouts({ callouts }: InsightsCalloutsProps) {
  if (!callouts) return null
  return (
    <>
      {callouts.map((c) => (
        <Badge key={c} variant="neutral">
          {c}
        </Badge>
      ))}
    </>
  )
}
