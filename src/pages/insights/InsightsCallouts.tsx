interface InsightsCalloutsProps {
  callouts: string[] | null
}

export function InsightsCallouts({ callouts }: InsightsCalloutsProps) {
  if (!callouts) return null
  return (
    <div className="callouts">
      {callouts.map((c) => (
        <span key={c} className="co">
          {c}
        </span>
      ))}
    </div>
  )
}
