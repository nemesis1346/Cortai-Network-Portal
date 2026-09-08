# COrtai Network Portal

Front-end for the COrtai managed network/security console — real-time device,
security, WAN, insights, and reporting views for a site under COrtai management.
Built contract-first against a typed mock service layer so the UI is never
blocked on the backend.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. All 7 modules are built: Command Center, Network
(devices awaiting registration + live topology), Security, Insights, WAN
Health, Controls, and the Monthly Report.

## Service layer

Everything the UI can ask of a backend sits behind **one interface** —
`PortalApi` in `src/api/portalTypes.ts`. Nothing outside `src/api/` holds
data or touches the network; every page only ever calls
`portalApi.<domain>.<method>()`.

`VITE_USE_MOCK` (see `.env.example`) controls `src/api/index.ts`, the **one
file** that changes when a real backend lands:

- unset, or anything other than `"false"` (default) — `mockPortalApi.ts`,
  in-memory seeded fixtures with artificial latency, no backend required.
- `"false"` — `realPortalApi.ts`, a reference client against extrapolated
  endpoint shapes, meant to be replaced by a backend team's own `PortalApi`
  implementation.

Every mutating action returns its own outcome message — the UI always shows
that server-authoritative text in its toast, never an invented "Done".

## Scripts

- `npm run dev` — Vite dev server.
- `npm run build` — typecheck + production build to `dist/`.
- `npm run lint` — ESLint.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run contract-check` — `scripts/check-contract.mjs` (see below).
- `npm run check` — all three checks; must pass clean before any change ships.

## Contract checker

`scripts/check-contract.mjs` is a static-analysis guard (TypeScript compiler
API) that keeps this app's core promises enforced automatically:

- The shared `components/ui`/`ui-v2` exports, CSS tokens, and global classes
  stay defined.
- The `@` → `src/*` alias stays wired (tsconfig + vite config).
- `src/api/index.ts` keeps exporting the single `portalApi` boundary, gated
  by `VITE_USE_MOCK`.
- Any page calling `portalApi.devices.*`/`portalApi.controls.*` imports it
  from `@/api` (not a one-off fetch) and never hardcodes a numeric/status
  literal directly in JSX text.
- Any mutating device/controls call never has its toast text hardcoded — it
  must come from the API's own response.

## Design system

`src/styles/v2/` — tokens and components for the current design (dark and
light, toggled via `[data-theme]` on `<html>`; persists to `localStorage`
and honors `prefers-color-scheme` on first visit). The original Nocturne/
Arctic token set in `src/index.css` still backs a handful of shared v1
primitives and is being phased out.

## Deploy

`deploy/scripts/deploy-ec2.sh` builds and rsyncs `dist/` over SSH to an
existing Ubuntu EC2 instance running nginx. Reads `EC2_HOST`/`EC2_KEY`/
`EC2_USER` from the root `.env` (see `.env.example`). Safe to re-run — every
step is idempotent.

```bash
bash deploy/scripts/deploy-ec2.sh
```

No TLS/domain is set up — HTTP only for now.
