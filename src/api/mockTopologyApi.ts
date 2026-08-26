import type { ClusterNode, DeviceDetail, InfraNode, TopologyApi } from './topologyTypes'

const NETWORK_DELAY_MS = 280

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS))
}

/** Ported verbatim from network.html's DEV object (lines 279-336). */
const CLUSTER_NODES: ClusterNode[] = [
  {
    key: 'laptops',
    crumb: 'Laptops',
    title: 'Laptops ×10',
    status: { tone: 'success', label: 'All online' },
    sub: 'Wireless · via FortiAP 231F',
    devices: [
      { id: 'LT-01', location: 'Front desk', meta: '10.255.201.11 · WiFi 5 GHz', rate: '18 Mbps', uptime: 'up 2d 0h' },
      { id: 'LT-02', location: 'Front desk', meta: '10.255.201.12 · WiFi 5 GHz', rate: '20.6 Mbps', uptime: 'up 4d 5h' },
      { id: 'LT-03', location: 'Sales', meta: '10.255.201.15 · WiFi 5 GHz', rate: '21.7 Mbps', uptime: 'up 3d 13h' },
      { id: 'LT-04', location: 'GM office', meta: '10.255.201.16 · WiFi 5 GHz', rate: '25.4 Mbps', uptime: 'up 4d 9h' },
      { id: 'LT-05', location: 'Housekeeping', meta: '10.255.201.19 · WiFi 5 GHz', rate: '29.1 Mbps', uptime: 'up 7d 12h' },
      { id: 'LT-06', location: 'Maintenance', meta: '10.255.201.20 · WiFi 5 GHz', rate: '20.5 Mbps', uptime: 'up 7d 15h' },
      { id: 'LT-07', location: 'Accounting', meta: '10.255.201.21 · WiFi 5 GHz', rate: '24.2 Mbps', uptime: 'up 2d 18h' },
      { id: 'LT-08', location: 'Sales', meta: '10.255.201.22 · WiFi 5 GHz', rate: '27.9 Mbps', uptime: 'up 3d 6h' },
      { id: 'LT-09', location: 'Accounting', meta: '10.255.201.25 · WiFi 5 GHz', rate: '31.6 Mbps', uptime: 'up 4d 3h' },
      { id: 'LT-10', location: 'Spare', meta: '10.255.201.28 · WiFi 5 GHz', rate: '19.3 Mbps', uptime: 'up 5d 0h' },
    ],
  },
  {
    key: 'desktops',
    crumb: 'Desktops',
    title: 'Desktops ×5',
    status: { tone: 'success', label: 'All online' },
    sub: 'Wired · via FortiSwitch 124F',
    devices: [
      { id: 'DT-01', location: 'Front desk', meta: '10.255.202.11 · Port 1 · 1 Gbps', rate: '12 Mbps', uptime: 'up 21d 4h' },
      { id: 'DT-02', location: 'Back office', meta: '10.255.202.12 · Port 2 · 1 Gbps', rate: '8.4 Mbps', uptime: 'up 21d 4h' },
      { id: 'DT-03', location: 'Accounting', meta: '10.255.202.13 · Port 3 · 1 Gbps', rate: '15.2 Mbps', uptime: 'up 9d 11h' },
      { id: 'DT-04', location: 'GM office', meta: '10.255.202.14 · Port 4 · 1 Gbps', rate: '6.1 Mbps', uptime: 'up 21d 4h' },
      { id: 'DT-05', location: 'Kitchen POS', meta: '10.255.202.15 · Port 5 · 1 Gbps', rate: '2.3 Mbps', uptime: 'up 44d 12h' },
    ],
  },
  {
    key: 'copier',
    crumb: 'Copier',
    title: 'Copier ×1',
    status: { tone: 'success', label: 'Online' },
    sub: 'Wired · via FortiSwitch 124F',
    devices: [
      { id: 'CP-01', location: 'Back office', meta: '10.255.202.31 · Port 15 · 1 Gbps', rate: '0.4 Mbps', uptime: 'up 12d 2h' },
    ],
  },
  {
    key: 'cameras',
    crumb: 'Cameras',
    title: 'IP cameras ×5',
    status: { tone: 'danger', label: '1 offline' },
    sub: 'IoT / access VLAN · via FortiSwitch 124F',
    devices: [
      { id: 'CAM-01', location: 'Front desk', meta: '10.255.201.17 · Port 2 · 1 Gbps', rate: '30 Mbps', uptime: 'up 12d 0h' },
      { id: 'CAM-02', location: 'Front desk', meta: '10.255.201.18 · Port 3 · 1 Gbps', rate: '41 Mbps', uptime: 'up 18d 5h' },
      { id: 'CAM-03', location: 'Sales', meta: '10.255.201.21 · Port 4 · 1 Gbps', rate: '52 Mbps', uptime: 'up 7d 13h' },
      { id: 'CAM-04', location: 'GM office', meta: '10.255.210.14 · Port 11 · PoE 0 W', rate: '64 Mbps', uptime: 'up 52d 9h', danger: true },
      { id: 'CAM-05', location: 'Housekeeping', meta: '10.255.201.25 · Port 6 · 1 Gbps', rate: '73 Mbps', uptime: 'up 12d 12h' },
    ],
  },
  {
    key: 'keypads',
    crumb: 'Door keypads',
    title: 'Door keypads ×5',
    status: { tone: 'success', label: 'All online' },
    sub: 'Access VLAN · via IoT Gateway',
    devices: [
      { id: 'DK-01', location: 'Main entrance', meta: '10.255.210.21 · LoRaWAN', rate: '—', uptime: 'up 61d 3h' },
      { id: 'DK-02', location: 'Loading dock', meta: '10.255.210.22 · LoRaWAN', rate: '—', uptime: 'up 61d 3h' },
      { id: 'DK-03', location: 'Back office', meta: '10.255.210.23 · LoRaWAN', rate: '—', uptime: 'up 61d 3h' },
      { id: 'DK-04', location: 'Pool', meta: '10.255.210.24 · LoRaWAN', rate: '—', uptime: 'up 33d 8h' },
      { id: 'DK-05', location: 'Staff corridor', meta: '10.255.210.25 · LoRaWAN', rate: '—', uptime: 'up 61d 3h' },
    ],
  },
]

/** Ported verbatim from network.html's INFO object (lines 338-397). */
const INFRA_NODES: InfraNode[] = [
  {
    key: 'gateway',
    crumb: 'FortiGate-40F',
    title: 'FortiGate-40F',
    status: { tone: 'success', label: 'Online' },
    sub: 'FGT40F-MAINLAN · Wired LAN',
    actions: [
      { variant: 'primary', label: 'Run diagnostics' },
      { variant: 'secondary', label: 'Backup config' },
    ],
    spec: [
      { label: 'IP', value: '10.255.200.1' },
      { label: 'MAC', value: '70:4C:A5:1E:22:01' },
      { label: 'FW', value: 'FortiOS 7.4.5' },
      { label: 'Model', value: 'FortiGate 40F' },
      { label: 'Uptime', value: '44d 12h' },
      { label: 'CPU', value: '11%' },
      { label: 'MEM', value: '38%' },
      { label: 'Sessions', value: '1,204' },
      { label: 'WAN', value: 'Bell Fibe 1G · 8ms' },
      { label: 'VPN', value: '2 tunnels up' },
    ],
    traffic: { value: '148.5 Mbps', seed: 3 },
    events: [
      { time: '09:12', text_html: 'Config backup completed to FortiCloud' },
      { time: '06:00', text_html: 'Scheduled AV/IPS definition update' },
      { time: 'Yesterday', text_html: 'Firmware check — up to date' },
    ],
  },
  {
    key: 'wireless',
    crumb: 'FortiAP 231F',
    title: 'FortiAP 231F',
    status: { tone: 'success', label: 'Online' },
    sub: 'FP231FTF2309F893 · Wireless',
    actions: [
      { variant: 'primary', label: 'Run diagnostics' },
      { variant: 'secondary', label: 'Restart radio' },
    ],
    spec: [
      { label: 'IP', value: '10.255.200.12' },
      { label: 'MAC', value: '70:4C:A5:2F:11:08' },
      { label: 'FW', value: 'FortiAP 7.4.3' },
      { label: 'Model', value: 'FortiAP 231F' },
      { label: 'Uptime', value: '21d 6h' },
      { label: 'Clients', value: '14' },
      { label: 'Band 2.4', value: 'ch 6 · 18%' },
      { label: 'Band 5', value: 'ch 36 · 31%' },
      { label: 'SSID', value: 'LIONSTON-CORP' },
      { label: 'Guest SSID', value: 'LIONSTON-GUEST' },
    ],
    traffic: { value: '96.2 Mbps', seed: 7 },
    events: [
      { time: '10:41', text_html: 'Client roam LT-04 → 5 GHz' },
      { time: '08:02', text_html: 'Guest SSID passphrase rotated' },
      { time: 'Yesterday', text_html: 'Channel re-plan — 2.4 GHz ch 6' },
    ],
  },
  {
    key: 'switch',
    crumb: 'FortiSwitch 124F',
    title: 'FortiSwitch 124F',
    status: { tone: 'warning', label: '1 port down' },
    sub: 'S124FFTF24020968 · Wired LAN',
    actions: [
      { variant: 'primary', label: 'Run diagnostics' },
      { variant: 'secondary', label: 'Port map' },
    ],
    spec: [
      { label: 'IP', value: '10.255.200.2' },
      { label: 'MAC', value: '70:4C:A5:1E:22:44' },
      { label: 'FW', value: 'FortiSwitchOS 7.4.4' },
      { label: 'Model', value: 'FortiSwitch 124F' },
      { label: 'Uptime', value: '44d 12h' },
      { label: 'Ports up', value: '17 / 24' },
      { label: 'PoE budget', value: '92 W / 370 W' },
      { label: 'Errors 24h', value: '0' },
      { label: 'Uplink', value: '1 Gbps · full' },
      { label: 'STP', value: 'Root — stable' },
    ],
    traffic: { value: '212.8 Mbps', seed: 11 },
    events: [
      { time: '08:47', text_html: 'Port 11 link down — <b class="c-danger">PoE draw 0 W</b>' },
      { time: '06:00', text_html: 'PoE budget check — OK' },
      { time: 'Yesterday', text_html: 'Firmware check — up to date' },
    ],
  },
  {
    key: 'iot',
    crumb: 'IoT Gateway',
    title: 'IoT Gateway',
    status: { tone: 'success', label: 'Online' },
    sub: 'UG65-L04EU · LoRaWAN · IoT / Access VLAN',
    actions: [
      { variant: 'primary', label: 'Run diagnostics' },
      { variant: 'secondary', label: 'Device registry' },
    ],
    spec: [
      { label: 'IP', value: '10.255.210.1' },
      { label: 'MAC', value: 'BC:32:5F:10:00:01' },
      { label: 'FW', value: 'UG65 3.2.1' },
      { label: 'Model', value: 'UG65-L04EU' },
      { label: 'Uptime', value: '61d 3h' },
      { label: 'End devices', value: '10' },
      { label: 'Frequency', value: 'EU868' },
      { label: 'Spreading', value: 'SF7–SF12' },
      { label: 'VLAN', value: '210 (IoT / access)' },
      { label: 'Egress policy', value: 'Deny by default' },
    ],
    traffic: { value: '1.2 Mbps', seed: 5 },
    events: [
      { time: '09:58', text_html: 'DK-04 join accept' },
      { time: '07:15', text_html: 'Gateway heartbeat — OK' },
      { time: 'Yesterday', text_html: 'Registry sync completed' },
    ],
  },
  {
    key: 'internet',
    crumb: 'Internet',
    title: 'Internet',
    status: { tone: 'success', label: 'Healthy' },
    sub: 'Bell Fibe 1G · WAN',
    actions: [
      { variant: 'primary', label: 'Speed test' },
      { variant: 'secondary', label: 'Open WAN Health' },
    ],
    spec: [
      { label: 'Provider', value: 'Bell Fibe' },
      { label: 'Plan', value: '1 Gbps / 750 Mbps' },
      { label: 'Public IP', value: '99.240.14.72' },
      { label: 'Latency', value: '8.2 ms' },
      { label: 'Jitter', value: '0.9 ms' },
      { label: 'Loss', value: '0.00%' },
      { label: 'Uptime 30d', value: '99.98%' },
      { label: 'Failover', value: 'LTE standby' },
    ],
    traffic: { value: '260.4 Mbps', seed: 2 },
    events: [
      { time: '—', text_html: 'No WAN events in the last 24h' },
      { time: 'Yesterday', text_html: 'Failover test — LTE reachable' },
    ],
  },
]

/** Ported verbatim from network.html's DETAIL object (lines 400-426) — only these 2 of ~26 devices have a full card, matching the source. */
const DEVICE_DETAILS: DeviceDetail[] = [
  {
    id: 'LT-01',
    parent: 'laptops',
    title: 'LT-01',
    status: { tone: 'success', label: 'Online' },
    sub: 'Front desk · Wireless',
    actions: [
      { variant: 'primary', label: 'Ping test' },
      { variant: 'secondary', label: 'Refresh stats' },
      { variant: 'secondary', label: 'Export log' },
    ],
    spec: [
      { label: 'IP', value: '10.255.201.11' },
      { label: 'MAC', value: '3C:22:FB:A:40:00' },
      { label: 'Link', value: 'Wi-Fi 5 GHz' },
      { label: 'SSID', value: 'LIONSTON-CORP' },
      { label: 'Uptime', value: '2d 0h' },
      { label: 'Band', value: '5 GHz · ch 36' },
      { label: 'Signal', value: '-38 dBm' },
      { label: 'TX', value: '-38 dBm avg' },
      { label: 'Util', value: '22%' },
      { label: 'PHY Rate', value: '433 Mbps' },
    ],
    traffic: { value: '12.5 Mbps', seed: 9, showRangeToggle: true },
    apps: [
      { name: 'Salesforce', category: 'Cloud / SaaS', volume: '1.39 Gb', percent: 22 },
      { name: 'Microsoft 365', category: 'Cloud / SaaS', volume: '1.41 Gb', percent: 23 },
      { name: 'Zoom', category: 'Real-time', volume: '0.86 Gb', percent: 14 },
      { name: 'Windows Update', category: 'System', volume: '0.52 Gb', percent: 9 },
      { name: 'Chrome — other', category: 'Web', volume: '1.91 Gb', percent: 32 },
    ],
  },
  {
    id: 'CAM-04',
    parent: 'cameras',
    title: 'CAM-04',
    status: { tone: 'danger', label: 'Offline · 42 min' },
    sub: 'Loading dock · IoT / access VLAN',
    actions: [
      { variant: 'primary', label: 'Power-cycle PoE port' },
      { variant: 'secondary', label: 'Ping test' },
      { variant: 'danger', label: 'Ticket' },
    ],
    fault: {
      title: 'Fault detected.',
      description: 'No PoE draw on port 11. Camera stopped responding at 08:47. Likely cable, injector, or camera PSU fault.',
    },
    spec: [
      { label: 'IP', value: '10.255.210.14' },
      { label: 'MAC', value: 'BC:32:5F:10:00:14' },
      { label: 'Link', value: 'Port 11 · PoE 0 W', danger: true },
      { label: 'Switch port', value: '11' },
      { label: 'Uptime', value: '—' },
      { label: 'Last Frame', value: '08:47:12' },
      { label: 'VLAN', value: '210 (camera)' },
      { label: 'PoE Draw', value: '0 W (was 6.1 W)' },
    ],
    traffic: { value: '0 Mbps', seed: 4, danger: true, showRangeToggle: true },
    events: [
      { time: '08:47', text_html: 'Port 11 link down — <b class="c-danger">PoE draw 0 W</b>' },
      { time: '08:47', text_html: 'RTSP stream lost' },
      { time: '08:46', text_html: 'Bitrate dropped 6.1 → 0.8 Mbps' },
      { time: '06:00', text_html: 'Recording verified — OK' },
    ],
  },
]

export const mockTopologyApi: TopologyApi = {
  listInfraNodes() {
    return delay(INFRA_NODES)
  },
  listClusterNodes() {
    return delay(CLUSTER_NODES)
  },
  listDeviceDetails() {
    return delay(DEVICE_DETAILS)
  },
}
