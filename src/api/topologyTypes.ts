export interface NodeStatus {
  tone: 'success' | 'warning' | 'danger'
  label: string
}

export interface SpecRow {
  label: string
  value: string
  danger?: boolean
}

export interface TrafficSpec {
  value: string
  seed: number
  danger?: boolean
  showRangeToggle?: boolean
}

export interface EventRow {
  time: string
  text_html: string
}

export interface ActionDef {
  variant: 'primary' | 'secondary' | 'danger'
  label: string
}

export interface AppUsageRow {
  name: string
  category: string
  volume: string
  percent: number
}

export interface InfraNode {
  key: string
  crumb: string
  title: string
  status: NodeStatus
  sub: string
  actions: ActionDef[]
  spec: SpecRow[]
  traffic: TrafficSpec
  events: EventRow[]
}

export interface ClusterDeviceRow {
  id: string
  location: string
  meta: string
  rate: string
  uptime: string
  danger?: boolean
}

export interface ClusterNode {
  key: string
  crumb: string
  title: string
  status: NodeStatus
  sub: string
  devices: ClusterDeviceRow[]
}

export interface DeviceDetail {
  id: string
  parent: string
  title: string
  status: NodeStatus
  sub: string
  actions: ActionDef[]
  fault?: { title: string; description: string }
  spec: SpecRow[]
  traffic: TrafficSpec
  apps?: AppUsageRow[]
  events?: EventRow[]
}

export interface TopologyApi {
  listInfraNodes(): Promise<InfraNode[]>
  listClusterNodes(): Promise<ClusterNode[]>
  listDeviceDetails(): Promise<DeviceDetail[]>
}
