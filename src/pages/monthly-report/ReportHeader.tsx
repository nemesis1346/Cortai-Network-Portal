import type { MonthlyReport } from '@/api'
import { Button, Card, Ring } from '@/components/ui-v2'

interface ReportHeaderProps {
  report: MonthlyReport
  onNavigate: (tab: string) => void
}

const GRADE_VALUE: Record<string, number> = {
  A: 100,
  B: 85,
  C: 70,
  D: 55,
  F: 30,
}

export function ReportHeader({ report, onNavigate }: ReportHeaderProps) {
  return (
    <Card variant="plain" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--spacing-20)' }}>
      <span className="card__glow card__glow--success" />
      <Ring value={GRADE_VALUE[report.grade] ?? 100} size="grade" radius={37} strokeWidth={2} variant="success">
        <span className="c-accent">{report.grade}</span>
      </Ring>
      <div style={{ flex: '1 1 auto', minInlineSize: 0 }}>
        <h2 className="t-h3 c-primary">{report.month} — Network &amp; Security Report</h2>
        <p className="t-body-sm c-tertiary" dangerouslySetInnerHTML={{ __html: report.headline_html }} />
      </div>
      <Button variant="primary" onClick={() => onNavigate('controls')}>
        Triage with Guardian
      </Button>
    </Card>
  )
}
