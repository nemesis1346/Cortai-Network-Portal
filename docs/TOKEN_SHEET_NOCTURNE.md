# Token sheet — Nocturne (dark) / Arctic (light)

Source of truth: `src/index.css` `:root` (dark, default) and `body.light` (light).
Ported 1:1 by name and value from the reference mockup `cortai-network-topology.html`
(lines 11–32 dark, 623–632 light) so the look is provably identical to the approved
design. **Do not introduce literal hex values in components** — everything goes
through `var(--token)`. `scripts/check-contract.mjs` enforces that every token below
stays defined.

| Token | Nocturne (dark) | Arctic (light) | Used for |
|---|---|---|---|
| `--bg` | `#0a1114` | `#f2f5f7` | page background |
| `--panel` | `#0f1a1e` | `#ffffff` | card / drawer surface |
| `--panel-2` | `#132227` | `#f5f8f9` | inset surface (inputs, kv cells) |
| `--line` | `#1e3138` | `#e3e9ec` | hairline borders |
| `--line-2` | `#2a444e` | `#ccd7dc` | stronger borders (buttons, inputs) |
| `--text` | `#dce8ea` | `#16232d` | primary text |
| `--text-2` | `#8aa3a9` | `#4a5a64` | secondary text |
| `--text-3` | `#5c7378` | `#7f8d96` | tertiary / label text |
| `--wired` | `#2dd4a7` | `#0e9f7f` | wired connections, primary/success accent |
| `--wired-dim` | `#1a6e58` | `#8fd6c4` | dimmed wired accent |
| `--wireless` | `#8b7cf6` | `#6d5fd8` | wireless connections |
| `--wireless-dim` | `#4a4090` | `#b9b0ef` | dimmed wireless accent |
| `--iot` | `#e0a458` | `#b8741a` | IoT devices, "awaiting" status (amber) |
| `--iot-dim` | `#7d5c31` | `#e2c092` | dimmed amber |
| `--danger` | `#f0564a` | `#d84438` | blocked status, destructive actions |
| `--danger-bg` | `#2a1512` | `#fdf1f0` | destructive surface tint |
| `--ok` | `#2dd4a7` | `#0e9f7f` | approved status, count pills |
| `--mono` | `'JetBrains Mono', monospace` | same | MAC addresses, timestamps, counts |
| `--sans` | `'Inter', sans-serif` | same | body text |
| `--disp` | `'Space Grotesk', sans-serif` | same | drawer/modal titles |

## Theme mechanism

One class flip on `<body>` (`body.light`) re-derives every color, since every
component reads `var(--token)` rather than a hex literal. `src/theme/ThemeProvider.tsx`:

- Persists the choice to `localStorage` (`cortai-theme`).
- Honors `prefers-color-scheme` on first visit (before any manual choice exists).
- These were both explicit "not yet done" TODOs in the reference mockup and its
  handoff README — done properly here from the start.

## Other carried-over rules

- `font-variant-numeric: tabular-nums` via the `.mono-num` utility class on any
  live-updating number (MAC addresses, HELD counts, timestamps).
- `@media (prefers-reduced-motion: reduce)` kills the toast slide-in and any
  keyframe animation.