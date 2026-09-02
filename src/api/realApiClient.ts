/**
 * Shared HTTP/WebSocket client for every real*Api.ts file — consolidates what
 * used to be 7 near-identical copy-pasted request() helpers into one place.
 * Endpoint shapes across the real-API layer are still unconfirmed extrapolations
 * (see each file's own header comment); confirm with Stefan before flipping
 * VITE_API_MODE=real.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? ''
export const SITE_ID = import.meta.env.VITE_SITE_ID ?? 'default'

/**
 * Single place to add real authentication once the backend team confirms the
 * mechanism (bearer token, API key, session cookie, ...). No auth env var
 * exists yet in .env.example — currently a no-op.
 */
function getAuthHeaders(): Record<string, string> {
  return {}
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...init?.headers },
  })
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

/**
 * Browsers can't set custom headers on a WebSocket handshake, so token-based
 * auth (once decided) would most likely go in the URL as a query param —
 * left as a TODO for whoever wires these up for real, same posture as the
 * "no reconnect/backoff logic yet" note in the files that use this.
 */
export function apiSocket(path: string): WebSocket {
  return new WebSocket(`${WS_BASE_URL}${path}`)
}
