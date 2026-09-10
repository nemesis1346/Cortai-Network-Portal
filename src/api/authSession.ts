/**
 * Holds the auth token outside React so realApiClient.ts (plain functions,
 * no hooks) can read it, and lets a 401 force a logout without every
 * real*Api.ts call site needing to know about auth.
 */
let currentToken: string | null = null

export function setCurrentToken(token: string | null): void {
  currentToken = token
}

export function getCurrentToken(): string | null {
  return currentToken
}

const logoutListeners = new Set<() => void>()

export function onForcedLogout(cb: () => void): () => void {
  logoutListeners.add(cb)
  return () => logoutListeners.delete(cb)
}

export function triggerForcedLogout(): void {
  logoutListeners.forEach((cb) => cb())
}
