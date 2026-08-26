export interface ScreenProps {
  onNavigate: (key: string) => void
}

export interface NavTabDef {
  key: string
  label: string
  /** Present only for tabs with a real, built screen — see AppShell's SCREENS map. */
  screen?: string
  /** Lucide sprite symbol name (v2 shell), e.g. 'shield' -> #i-shield. */
  icon: string
}

/** 7 tabs per the Nocturne mockup nav (cortai-network-topology.html:681-688), icons per the v2 shell's own NAV array. */
export const NAV_TABS: NavTabDef[] = [
  { key: 'command-center', label: 'Command Center', screen: 'command-center', icon: 'layout-dashboard' },
  { key: 'network', label: 'Network', screen: 'devices-awaiting', icon: 'network' },
  { key: 'security', label: 'Security', screen: 'security', icon: 'shield' },
  { key: 'insights', label: 'Insights', screen: 'insights', icon: 'laptop' },
  { key: 'wan-health', label: 'WAN Health', screen: 'wan-health', icon: 'activity' },
  { key: 'controls', label: 'Controls', screen: 'controls', icon: 'settings' },
  { key: 'report', label: 'Report', screen: 'monthly-report', icon: 'bar-chart-2' },
]