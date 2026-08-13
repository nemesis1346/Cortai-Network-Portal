export interface ReportKpi {
  label: string
  value: string
  colorClass?: 'red' | 'green'
  sub: string
}

export interface ReportHighlight {
  message_html: string
}

export interface ReportComparisonRow {
  label: string
  us: string
  telco: string
}

export interface MonthlyReport {
  month: string
  grade: string
  headline_html: string
  kpis: ReportKpi[]
  highlights: ReportHighlight[]
  comparison: ReportComparisonRow[]
}

export interface ReportApi {
  getMonthlyReport(): Promise<MonthlyReport>
  /** Mocked — matches source's fake toast-only "Export PDF" button. */
  exportPdf(): Promise<{ message: string }>
}
