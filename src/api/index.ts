import type { PortalApi } from './portalTypes'
import { mockPortalApi } from './mockPortalApi'
import { realPortalApi } from './realPortalApi'

/**
 * THE ONE FILE to change when a real backend is ready: set VITE_USE_MOCK=false
 * (see .env.example) and point `portalApi` at your PortalApi implementation.
 * No page or component changes needed — they only ever call portalApi.*.
 *
 * Defaults to the mock unless VITE_USE_MOCK is explicitly "false", so a checkout
 * with no .env runs against fixtures.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const portalApi: PortalApi = USE_MOCK ? mockPortalApi : realPortalApi

export type { PortalApi } from './portalTypes'
export * from './unavailableError'
export * from './invalidCodeError'
export * from './errorMessage'
export * from './authTypes'
export * from './types'
export * from './homeTypes'
export * from './controlsTypes'
export * from './securityTypes'
export * from './insightsTypes'
export * from './wanTypes'
export * from './reportTypes'
export * from './topologyTypes'
