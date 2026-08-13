import { useEffect, useState } from 'react'
import { reportApi, type MonthlyReport as MonthlyReportData } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { ComparisonCard } from './ComparisonCard'
import { ReportHeader } from './ReportHeader'
import { ReportKpis } from './ReportKpis'
import { WhatWeDidCard } from './WhatWeDidCard'
import './monthly-report.css'

export function MonthlyReport(_props: ScreenProps) {
  const [report, setReport] = useState<MonthlyReportData | null>(null)

  useEffect(() => {
    reportApi.getMonthlyReport().then(setReport)
  }, [])

  return (
    <div className="report-page">
      {report && (
        <>
          <ReportHeader report={report} />
          <ReportKpis kpis={report.kpis} />
          <div className="grid g21">
            <WhatWeDidCard highlights={report.highlights} />
            <ComparisonCard comparison={report.comparison} />
          </div>
        </>
      )}
    </div>
  )
}
