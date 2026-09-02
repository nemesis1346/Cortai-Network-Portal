import type { InsightsApi, InsightsData } from './insightsTypes'
import { apiRequest, SITE_ID } from './realApiClient'

/**
 * Thin fetch() wrapper against the endpoint proposed in
 * docs/spec-ihm-cortai-network-ops.pdf (page 8): GET /sites/{id}/insights?scope=&range=.
 * Only `scope` is sent — `range` has no frontend control yet (Insights' own time-range
 * toggles are decorative, matching the v2 mock's own non-functional ones); add it here
 * once a real range selector exists. Not wired in by default — see ./index.ts. Confirm
 * exact response envelope with Stefan before flipping VITE_API_MODE=real.
 */
export const realInsightsApi: InsightsApi = {
  getInsights(scope) {
    return apiRequest<InsightsData>(`/api/v1/sites/${SITE_ID}/insights?scope=${encodeURIComponent(scope)}`)
  },
}
