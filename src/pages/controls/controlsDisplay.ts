import type { ChangeBadge, ChangeStep, GuardTier } from '@/api'
import { CHANGE_BADGE_LABEL } from '@/api'

export function tierAccentColor(tier: GuardTier): string {
  switch (tier) {
    case 1:
      return 'var(--wired)'
    case 2:
      return 'var(--wireless)'
    case 3:
      return 'var(--iot)'
    case 4:
      return 'var(--text-2)'
  }
}

const BADGE_COLOR: Record<ChangeBadge, { color: string; bg: string }> = {
  done: { color: 'var(--ok)', bg: 'rgba(45,212,167,.12)' },
  sched: { color: 'var(--wireless)', bg: 'rgba(139,124,246,.14)' },
  sub: { color: 'var(--wireless)', bg: 'rgba(139,124,246,.14)' },
  rev: { color: 'var(--iot)', bg: 'rgba(224,164,88,.14)' },
  blk: { color: '#f78d84', bg: 'rgba(240,86,74,.14)' },
  can: { color: 'var(--iot)', bg: 'rgba(224,164,88,.14)' },
  ai: { color: 'var(--wired)', bg: 'linear-gradient(90deg,rgba(45,212,167,.15),rgba(139,124,246,.15))' },
}

export function badgeVisual(badge: ChangeBadge): { label: string; color: string; bg: string } {
  return { label: CHANGE_BADGE_LABEL[badge], ...BADGE_COLOR[badge] }
}

const TIER_TAG_COLOR: Record<GuardTier, { color: string; bg: string }> = {
  1: { color: 'var(--ok)', bg: 'rgba(45,212,167,.13)' },
  2: { color: 'var(--wireless)', bg: 'rgba(139,124,246,.15)' },
  3: { color: 'var(--iot)', bg: 'rgba(224,164,88,.15)' },
  4: { color: 'var(--text-2)', bg: 'rgba(140,150,155,.14)' },
}

export function tierTagVisual(tier: GuardTier): { label: string; color: string; bg: string } {
  return { label: `T${tier}`, ...TIER_TAG_COLOR[tier] }
}

export function stepMark(state: ChangeStep['state'], running: boolean): string {
  if (running) return '◌'
  if (state === 'ok') return '✓'
  if (state === 'warn') return '⚠'
  return '○'
}
