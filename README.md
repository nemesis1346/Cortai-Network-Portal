# COrtai Network Portal — Module 1: Devices Awaiting Registration

Front-end for the "Devices Awaiting Registration" module of the COrtai managed
network/security console. A new device on the network is quarantined by default;
this screen is where a manager reviews it, assigns a VLAN, and approves it onto
the network (or quarantines/blocks it). Built contract-first against a mock
adapter so the UI isn't blocked on the real CoreTi/FortiManager backend.

Design reference: `cortai-network-topology.html` (the "Nocturne" dark-theme mockup).
Scope: `CNIS_FrontEnd_Scope_DevicesAwaitingRegistration.md`.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. The **Network** tab has the real screen; the other
6 nav tabs are intentionally stubbed "coming soon" — nothing else was in scope
for this module.

## Mock vs real backend

`VITE_API_MODE` (see `.env.example`) controls `src/api/index.ts`, the **one file**
that changes when Stefan's FortiManager-backed API lands:

- `mock` (default) — `src/api/mockDeviceApi.ts`, an in-memory array seeded with
  3 example devices, artificial latency, no backend required.
- `real` — `src/api/realDeviceApi.ts`, a thin `fetch()` client against
  `GET/POST/PATCH /api/devices/...` per the scope doc's documented contract.

Every mutating action (`approve`/`quarantine`/`block`/`patch`) returns
`{ device, outcomeMessage }` — the UI always shows the server-authoritative
`outcomeMessage` in its toast, never an invented "Done".

## Scripts

- `npm run dev` — Vite dev server.
- `npm run build` — typecheck + production build to `dist/`.
- `npm run lint` — ESLint.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run contract-check` — `scripts/check-contract.mjs` (see below).
- `npm run check` — all three checks, must pass clean before calling Module 1 done.

## Contract checker

`scripts/check-contract.mjs` is a static-analysis guard (TypeScript compiler API)
that keeps this app's core promises enforced automatically:

- The shared `components/ui` exports, CSS tokens, and global classes stay defined.
- The `@` → `src/*` alias stays wired (tsconfig + vite config).
- `src/api/index.ts` keeps exporting the swappable `deviceApi`.
- Any page calling `deviceApi.*` imports it from `@/api` (not a one-off fetch)
  and never hardcodes a numeric/status literal directly in JSX text.
- Any mutating call (`approve`/`quarantine`/`block`/`patch`) never has its toast
  text hardcoded — it must come from the API's `outcomeMessage`.

## Design tokens

`src/index.css` + `docs/TOKEN_SHEET_NOCTURNE.md` — Nocturne (dark, default) and
Arctic (light) themes, ported 1:1 from the reference mockup. Theme toggle
persists to `localStorage` and honors `prefers-color-scheme` on first visit.

## Deploy

`deploy/scripts/deploy-ec2.sh` builds and rsyncs `dist/` over SSH to an existing Ubuntu
EC2 instance running nginx. Reads `EC2_HOST`/`EC2_KEY`/`EC2_USER` from the root `.env`
(see `.env.example`). Safe to re-run — every step is idempotent.

```bash
bash deploy/scripts/deploy-ec2.sh
```

No TLS/domain is set up — HTTP only for now.

## Out of scope for Module 1

Everything else — Command Center, Security, Insights, WAN Health, Controls, Report,
plus device-detail drill-down, health score, staff activity, app-health, self-help
tiers, insights map — is stubbed as "coming soon", never broken, per the scope doc's
explicit instruction not to over-build.