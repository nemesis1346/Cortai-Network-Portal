import { useToast } from '@/components/ui'
import { reportApi, type MonthlyReport } from '@/api'

interface ReportHeaderProps {
  report: MonthlyReport
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const toast = useToast()

  const handleExport = () => {
    reportApi.exportPdf().then((result) => toast.show(result.message))
  }

  return (
    <div className="rep-head">
      <div className="grade">{report.grade}</div>
      <div>
        <div className="t1">{report.month} — Network &amp; Security Report</div>
        <div className="t2" dangerouslySetInnerHTML={{ __html: report.headline_html }} />
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <button className="btn primary" onClick={handleExport}>
          Export PDF
        </button>
      </div>
    </div>
  )
}
