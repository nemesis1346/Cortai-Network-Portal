import { Fragment } from 'react'
import type { ReportComparisonRow } from '@/api'
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui-v2'

interface ComparisonCardProps {
  comparison: ReportComparisonRow[]
}

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Why this is different</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="compare">
          <span className="h" />
          <span className="h">CORTAI managed</span>
          <span className="h">Typical telco</span>

          {comparison.map((row) => (
            <Fragment key={row.label}>
              <span className="k">{row.label}</span>
              <span className="y">{row.us}</span>
              <span className="n">{row.telco}</span>
            </Fragment>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
