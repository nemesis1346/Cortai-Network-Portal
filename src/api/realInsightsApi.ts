import type { InsightsApi, InsightsData } from './insightsTypes'

/**
 * Thin fetch() wrapper against the endpoint proposed in
 * docs/spec-ihm-cortai-network-ops.pdf (page 8): GET /sites/{id}/insights?scope=&range=.
 * Not wired in by default — see ./index.ts. Confirm exact response envelope with
 * Stefan before flipping VITE_API_MODE=real.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const SITE_ID = import.meta.env.VITE_SITE_ID ?? 'default'

export const realInsightsApi: InsightsApi = {
  async getInsights(scope) {
    const res = await fetch(`${BASE_URL}/api/v1/sites/${SITE_ID}/insights?scope=${encodeURIComponent(scope)}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`Request to /insights failed: ${res.status} ${res.statusText}`)
    }
    return res.json() as Promise<InsightsData>
  },
}
