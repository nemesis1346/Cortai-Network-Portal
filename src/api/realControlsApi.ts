import type { ChangeRecord, ControlsApi, PolicyToggle, TriageResult } from './controlsTypes'
import { apiRequest, SITE_ID } from './realApiClient'

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
export const realControlsApi: ControlsApi = {
  triage(description) {
    return apiRequest<TriageResult>(`/api/v1/sites/${SITE_ID}/changes/triage`, {
      method: 'POST',
      body: JSON.stringify({ description }),
    })
  },

  runChange(triage) {
    return apiRequest<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'run', triage }),
    })
  },

  scheduleChange(triage) {
    return apiRequest<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'schedule', triage }),
    })
  },

  submitToEngineer(triage) {
    return apiRequest<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'submit-to-engineer', triage }),
    })
  },

  unblockFromDiagnosis(description) {
    return apiRequest<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'unblock-from-diagnosis', description }),
    })
  },

  listPolicies() {
    return apiRequest<PolicyToggle[]>(`/api/v1/sites/${SITE_ID}/policies`)
  },

  togglePolicy(key) {
    return apiRequest(`/api/v1/sites/${SITE_ID}/policies/${encodeURIComponent(key)}/toggle`, { method: 'POST' })
  },

  listBlockedDomains() {
    return apiRequest<string[]>(`/api/v1/sites/${SITE_ID}/blocked-domains`)
  },

  blockDomain(domain) {
    return apiRequest(`/api/v1/sites/${SITE_ID}/blocked-domains`, {
      method: 'POST',
      body: JSON.stringify({ domain }),
    })
  },

  unblockDomain(domain) {
    return apiRequest(`/api/v1/sites/${SITE_ID}/blocked-domains/${encodeURIComponent(domain)}`, { method: 'DELETE' })
  },

  // Same flat /api/devices/{mac}/... convention as realDeviceApi.ts — this is a
  // device action, not a site-scoped Controls resource, per the Module 1 scope doc.
  pauseDevice(mac, label) {
    return apiRequest(`/api/devices/${encodeURIComponent(mac)}/pause`, {
      method: 'POST',
      body: JSON.stringify({ label }),
    })
  },

  listChanges() {
    return apiRequest<ChangeRecord[]>(`/api/v1/sites/${SITE_ID}/changes`)
  },

  reverseChange(num) {
    return apiRequest<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes/${num}/reverse`, { method: 'POST' })
  },

  logContainment(input) {
    return apiRequest<ChangeRecord>(`/api/v1/sites/${SITE_ID}/changes`, {
      method: 'POST',
      body: JSON.stringify({ action: 'log-containment', ...input }),
    })
  },
}
