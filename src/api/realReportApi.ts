import type { MonthlyReport, ReportApi } from './reportTypes'

/**
 * Thin fetch() wrapper against a proposed /reports/ namespace — the spec doc doesn't
 * enumerate Report endpoints explicitly, so these paths are a reasonable extrapolation
 * under the same convention as the other real-API files. Not wired in by default — see
 * ./index.ts. Confirm exact response envelopes with Stefan before flipping VITE_API_MODE=real.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const SITE_ID = import.meta.env.VITE_SITE_ID ?? 'default'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const realReportApi: ReportApi = {
  getMonthlyReport() {
    return request<MonthlyReport>(`/api/v1/sites/${SITE_ID}/reports/monthly`)
  },

  exportPdf() {
    return request<{ message: string }>(`/api/v1/sites/${SITE_ID}/reports/monthly/export`, { method: 'POST' })
  },
}
