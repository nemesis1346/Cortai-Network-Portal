/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "false" selects the real PortalApi implementation; anything else (or unset) uses the mock. */
  readonly VITE_USE_MOCK?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SITE_ID?: string
  readonly VITE_WS_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
