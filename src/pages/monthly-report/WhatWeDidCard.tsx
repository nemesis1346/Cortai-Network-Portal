import type { ReportHighlight } from '@/api'

interface WhatWeDidCardProps {
  highlights: ReportHighlight[]
}

export function WhatWeDidCard({ highlights }: WhatWeDidCardProps) {
  return (
    <div className="card">
      <h3>What we did for you this month</h3>
      {highlights.map((highlight, i) => (
        <div key={i} className="did-row">
          <div className="tick">✓</div>
          <div className="m" dangerouslySetInnerHTML={{ __html: highlight.message_html }} />
        </div>
      ))}
    </div>
  )
}
