import type { ChangeRecord, ControlsApi, PolicyToggle, TriageResult } from './controlsTypes'

/**
 * Thin fetch() wrapper against the Guardian triage/changes endpoints proposed in
 * docs/spec-ihm-cortai-network-ops.pdf (page 15-16). Not wired in by default — see
 * ./index.ts. The spec doc is explicit that triage becomes a server-side LLM call
 * with a structured {tier, intent_id, plan[], confidence, requires_approval} output
 * and a low-confidence fallback to Tier 3 — this client just consumes that contract.
 * Confirm exact response envelopes with Stefan before flipping VITE_API_MODE=real.
 * No WebSocket execution-progress channel yet — out of scope while unused, same
 * posture as realHomeApi's activity feed.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const SITE_ID = import.meta.env.VITE_SITE_ID ?? 'default'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const realControlsApi: ControlsApi = {
  triage(description) {
    return request<TriageResult>(`/api/v1/sites/${SITE_ID}/changes/triage`, {
      method: 'POST',
      body: JSON.stringify({ description }),
    })
  },

  runChange(triage) {
    return request<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'run', triage }),
    })
  },

  scheduleChange(triage) {
    return request<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'schedule', triage }),
    })
  },

  submitToEngineer(triage) {
    return request<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'submit-to-engineer', triage }),
    })
  },

  unblockFromDiagnosis(description) {
    return request<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'unblock-from-diagnosis', description }),
    })
  },

  listPolicies() {
    return request<PolicyToggle[]>(`/api/v1/sites/${SITE_ID}/policies`)
  },

  togglePolicy(key) {
    return request(`/api/v1/sites/${SITE_ID}/policies/${encodeURIComponent(key)}/toggle`, { method: 'POST' })
  },

  listBlockedDomains() {
    return request<string[]>(`/api/v1/sites/${SITE_ID}/blocked-domains`)
  },

  blockDomain(domain) {
    return request(`/api/v1/sites/${SITE_ID}/blocked-domains`, {
      method: 'POST',
      body: JSON.stringify({ domain }),
    })
  },

  unblockDomain(domain) {
    return request(`/api/v1/sites/${SITE_ID}/blocked-domains/${encodeURIComponent(domain)}`, { method: 'DELETE' })
  },

  pauseDevice(mac, label) {
    return request(`/api/v1/sites/${SITE_ID}/devices/${encodeURIComponent(mac)}/pause`, {
      method: 'POST',
      body: JSON.stringify({ label }),
    })
  },

  listChanges() {
    return request<ChangeRecord[]>(`/api/v1/sites/${SITE_ID}/changes`)
  },

  reverseChange(num) {
    return request<ChangeRecord>(`/api/v1/changes/${num}/reverse`, { method: 'POST' })
  },
}
