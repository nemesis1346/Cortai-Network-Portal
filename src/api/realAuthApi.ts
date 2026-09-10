import type { AuthApi } from './authTypes'
import { apiRequest } from './realApiClient'

/**
 * Thin fetch() wrapper for the two-step login. Paths aren't confirmed against
 * a real backend yet — same posture as every other real*Api.ts file. Backend
 * team owns finalizing the exact endpoints/response shapes.
 */
export const realAuthApi: AuthApi = {
  requestCode(email) {
    return apiRequest<void>('/auth/request-code', { method: 'POST', body: JSON.stringify({ email }) })
  },

  verifyCode(email, code) {
    return apiRequest<{ token: string }>('/auth/verify-code', { method: 'POST', body: JSON.stringify({ email, code }) })
  },
}
