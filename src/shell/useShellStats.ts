import { useEffect, useState } from 'react'
import { homeApi, wanApi } from '@/api'

interface ShellStats {
  devices: number | null
  throughputMbps: number | null
  alerts: number | null
}

/**
 * Real numbers only — sourced from the same calls already proven elsewhere
 * (homeApi.getKpis powers Command Center's ImpactBanner, homeApi.listAttention
 * powers NeedsAttentionList, wanApi.getStatus powers WAN Health). There is no
 * "online device count" here on purpose: no field for it exists yet anywhere
 * in the API — see the migration plan.
 */
export function useShellStats(): ShellStats {
  const [stats, setStats] = useState<ShellStats>({ devices: null, throughputMbps: null, alerts: null })

  useEffect(() => {
    homeApi.getKpis('1d').then((kpis) =>
      setStats((prev) => ({ ...prev, devices: kpis.devices_protected })),
    )
    homeApi.listAttention().then((items) =>
      setStats((prev) => ({ ...prev, alerts: items.length })),
    )
    wanApi.getStatus().then((status) =>
      setStats((prev) => ({ ...prev, throughputMbps: status.primary.downMbps })),
    )
  }, [])

  return stats
}
