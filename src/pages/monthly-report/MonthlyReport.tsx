import { useEffect, useState } from 'react'
import { reportApi, type MonthlyReport as MonthlyReportData } from '@/api'
import type { ScreenProps } from '@/shell/nav-data'
import { ComparisonCard } from './ComparisonCard'
import { ReportHeader } from './ReportHeader'
import { ReportKpis } from './ReportKpis'
import { WhatWeDidCard } from './WhatWeDidCard'

export function MonthlyReport({ onNavigate }: ScreenProps) {
  const [report, setReport] = useState<MonthlyReportData | null>(null)

  useEffect(() => {
    reportApi.getMonthlyReport().then(setReport)
  }, [])

  if (!report) return null

  return (
    <>
      <div className="row" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', flex: '0 0 auto' }}>
        <ReportKpis kpis={report.kpis} />
      </div>

      <div className="row" style={{ gridTemplateColumns: 'minmax(0,1fr)', flex: '0 0 auto' }}>
        <ReportHeader report={report} onNavigate={onNavigate} />
      </div>

      <div className="row" style={{ gridTemplateColumns: '1fr 1fr', flex: '704 1 0', minBlockSize: 380 }}>
        <WhatWeDidCard highlights={report.highlights} />
        <ComparisonCard comparison={report.comparison} />
      </div>
    </>
  )
}
