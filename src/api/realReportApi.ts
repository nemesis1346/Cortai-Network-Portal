import type { MonthlyReport, ReportApi } from './reportTypes'
import { apiRequest, SITE_ID } from './realApiClient'

/**
 * Thin fetch() wrapper against a proposed /reports/ namespace — the spec doc doesn't
 * enumerate Report endpoints explicitly, so these paths are a reasonable extrapolation
 * under the same convention as the other real-API files. Not wired in by default — see
 * ./index.ts. Confirm exact response envelopes with Stefan before flipping VITE_API_MODE=real.
 */
export const realReportApi: ReportApi = {
  getMonthlyReport() {
    return apiRequest<MonthlyReport>(`/api/v1/sites/${SITE_ID}/reports/monthly`)
  },

  exportPdf() {
    return apiRequest<{ message: string }>(`/api/v1/sites/${SITE_ID}/reports/monthly/export`, { method: 'POST' })
  },
}
