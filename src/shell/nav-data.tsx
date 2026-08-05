export interface ScreenProps {
  onNavigate: (key: string) => void
}

export interface NavTabDef {
  key: string
  label: string
  /** Present only for tabs with a real, built screen — see AppShell's SCREENS map. */
  screen?: string
}

/** 7 tabs per the Nocturne mockup nav (cortai-network-topology.html:681-688). */
export const NAV_TABS: NavTabDef[] = [
  { key: 'command-center', label: 'Command Center', screen: 'command-center' },
  { key: 'network', label: 'Network', screen: 'devices-awaiting' },
  { key: 'security', label: 'Security' },
  { key: 'insights', label: 'Insights' },
  { key: 'wan-health', label: 'WAN Health' },
  { key: 'controls', label: 'Controls' },
  { key: 'report', label: 'Report' },
]