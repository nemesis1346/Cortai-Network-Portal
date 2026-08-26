/**
 * Ported verbatim from network.html's static markup (lines 51-179) — a
 * fixed, hand-authored 1160×830 canvas, not a computed graph layout. See
 * the CSS comment on .topo-canvas: "device cards are drawn at exactly the
 * sizes they have in Figma and do not squeeze."
 */

export interface NodeTag {
  variant: 'neutral' | 'success' | 'danger'
  label: string
}

export interface NodeCardConfig {
  key: string
  x: number
  y: number
  w: number
  /** `net-node--{variant}` modifier class; undefined = plain (rail is the default success green). */
  variant?: 'hub' | 'wireless' | 'iot' | 'fault'
  /** Undefined only for the Internet hub, which has no kicker row. */
  kicker?: string
  /** Cluster nodes only — the card's own name differs from the drawer's
   * (shorter) breadcrumb label for Cameras ("IP cameras" vs "Cameras" in
   * the source itself); infra nodes reuse InfraNode.title directly. */
  name?: string
  tags: NodeTag[]
}

/** Presentational card content (kicker label + tag badges), hand-authored in
 * the HTML alongside the node's position — a distinct, static counterpart to
 * the fetched drawer content (topologyApi's InfraNode/ClusterNode). */
export const NODE_CARDS: NodeCardConfig[] = [
  { key: 'internet', x: 60, y: 370, w: 148, variant: 'hub', tags: [{ variant: 'neutral', label: 'WAN' }] },
  { key: 'gateway', x: 273, y: 356, w: 224, kicker: 'Gateway', tags: [{ variant: 'neutral', label: 'FG40F-MAINLAN' }] },
  { key: 'wireless', x: 561, y: 66, w: 229, variant: 'wireless', kicker: 'Wireless', tags: [{ variant: 'neutral', label: 'FP231FTF2309F893' }] },
  { key: 'switch', x: 561, y: 356, w: 229, kicker: 'Switching', tags: [{ variant: 'neutral', label: 'S124FFTF24020968' }] },
  { key: 'iot', x: 561, y: 644, w: 229, variant: 'iot', kicker: 'IoT / Access', tags: [{ variant: 'neutral', label: 'UG65-L04EU · LoRaWAN' }] },
  { key: 'laptops', x: 850, y: 66, w: 243, variant: 'wireless', kicker: 'Cluster', name: 'Laptops', tags: [{ variant: 'neutral', label: 'WiFi' }, { variant: 'success', label: 'All online' }] },
  { key: 'desktops', x: 850, y: 210, w: 243, kicker: 'Cluster', name: 'Desktops', tags: [{ variant: 'neutral', label: 'Wired' }, { variant: 'success', label: 'All online' }] },
  { key: 'copier', x: 850, y: 354, w: 243, kicker: 'Cluster', name: 'Copier', tags: [{ variant: 'neutral', label: 'Wired' }, { variant: 'success', label: 'Online' }] },
  { key: 'cameras', x: 855, y: 498, w: 243, variant: 'fault', kicker: 'Cluster', name: 'IP cameras', tags: [{ variant: 'success', label: '1 online' }, { variant: 'danger', label: '1 down' }] },
  { key: 'keypads', x: 855, y: 642, w: 243, variant: 'iot', kicker: 'Cluster', name: 'Door keypads', tags: [{ variant: 'neutral', label: 'Access' }, { variant: 'success', label: 'All online' }] },
]

export type LinkKind = 'wired' | 'wireless' | 'iot'

export interface TopologyLink {
  kind: LinkKind
  d: string
}

export const LINKS: TopologyLink[] = [
  { kind: 'wired', d: 'M208,409 H273' },
  { kind: 'wired', d: 'M497,409 H561' },
  { kind: 'wireless', d: 'M497,402 H525 V121 H561' },
  { kind: 'wireless', d: 'M790,121 H850' },
  { kind: 'wired', d: 'M790,395 H820 V265 H850' },
  { kind: 'wired', d: 'M790,409 H850' },
  { kind: 'iot', d: 'M675,462 V644' },
  { kind: 'iot', d: 'M790,430 H825 V553 H855' },
  { kind: 'iot', d: 'M790,697 H855' },
]

export type TopologyDot =
  | { shape: 'rect'; x: number; y: number; size: number; rx?: number; rotate?: { deg: number; cx: number; cy: number }; color: string }
  | { shape: 'arrow'; d: string; color: string }

export const DOTS: TopologyDot[] = [
  { shape: 'rect', x: 235, y: 404, size: 10, rotate: { deg: 45, cx: 240, cy: 409 }, color: 'var(--color-status-success)' },
  { shape: 'rect', x: 524, y: 404, size: 10, rotate: { deg: 45, cx: 529, cy: 409 }, color: 'var(--color-status-success)' },
  { shape: 'rect', x: 815, y: 116, size: 10, rx: 5, color: 'var(--color-status-info)' },
  { shape: 'rect', x: 520, y: 397, size: 9, rx: 4.5, color: 'var(--color-status-info)' },
  { shape: 'rect', x: 815, y: 260, size: 10, rotate: { deg: 45, cx: 820, cy: 265 }, color: 'var(--color-status-success)' },
  { shape: 'rect', x: 815, y: 404, size: 10, rotate: { deg: 45, cx: 820, cy: 409 }, color: 'var(--color-status-success)' },
  { shape: 'rect', x: 670, y: 548, size: 10, rotate: { deg: 45, cx: 675, cy: 553 }, color: 'var(--color-status-warning)' },
  { shape: 'arrow', d: 'M840,691 l14 6 -14 6 z', color: 'var(--color-status-warning)' },
]
