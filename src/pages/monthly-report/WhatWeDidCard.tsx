import type { ReportHighlight } from '@/api'
import { reportApi } from '@/api'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Icon, IconBadge } from '@/components/ui-v2'
import { useToast } from '@/components/ui'

interface WhatWeDidCardProps {
  highlights: ReportHighlight[]
}

export function WhatWeDidCard({ highlights }: WhatWeDidCardProps) {
  const { show: showToast } = useToast()

  const downloadPdf = () => {
    reportApi.exportPdf().then((result) => showToast(result.message))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>What we did for you this month</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="feed">
          {highlights.map((highlight, i) => (
            <div key={i} className="feed__item">
              <IconBadge variant="green" size="sm">
                <Icon name="check" />
              </IconBadge>
              <span className="feed__main">
                <span className="feed__title" dangerouslySetInnerHTML={{ __html: highlight.message_html }} />
              </span>
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm" onClick={downloadPdf}>
          Download PDF
        </Button>
        <Button variant="secondary" size="sm" onClick={() => showToast('Report emailed to the owner')}>
          Email to owner
        </Button>
      </CardFooter>
    </Card>
  )
}
