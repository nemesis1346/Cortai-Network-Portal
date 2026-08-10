import type { EastWestState, LateralSeverity } from '@/api'

export function matrixCellVisual(state: EastWestState): { bg: string; border: string; valueColor: string } {
  switch (state) {
    case 'ok':
      return { bg: 'rgba(45,212,167,.09)', border: 'rgba(45,212,167,.3)', valueColor: 'var(--ok)' }
    case 'blkd':
      return { bg: 'rgba(240,86,74,.09)', border: 'rgba(240,86,74,.35)', valueColor: 'var(--danger)' }
    case 'iso':
      return { bg: 'var(--panel-2)', border: 'var(--line)', valueColor: 'var(--text-3)' }
    case 'self':
      return { bg: 'transparent', border: 'var(--line)', valueColor: 'var(--text-3)' }
  }
}

export function lateralSeverityColor(severity: LateralSeverity): string {
  switch (severity) {
    case 'hi':
      return 'var(--danger)'
    case 'med':
      return 'var(--iot)'
    case 'lo':
      return 'var(--text-3)'
  }
}
