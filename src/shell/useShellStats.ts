import { useEffect, useState } from 'react'
import { portalApi } from '@/api'

interface ShellStats {
  devices: number | null
  throughputMbps: number | null
  alerts: number | null
}

/**
 * Real numbers only — sourced from the same calls already proven elsewhere
 * (portalApi.home.getKpis powers Command Center's ImpactBanner, portalApi.home.listAttention
 * powers NeedsAttentionList, portalApi.wan.getStatus powers WAN Health). There is no
 * "online device count" here on purpose: no field for it exists yet anywhere
 * in the API — see the migration plan.
 */
export function useShellStats(): ShellStats {
  const [stats, setStats] = useState<ShellStats>({ devices: null, throughputMbps: null, alerts: null })

  useEffect(() => {
    portalApi.home.getKpis('1d').then((kpis) =>
      setStats((prev) => ({ ...prev, devices: kpis.devices_protected })),
    )
    portalApi.home.listAttention().then((items) =>
      setStats((prev) => ({ ...prev, alerts: items.length })),
    )
    portalApi.wan.getStatus().then(
      (status) => setStats((prev) => ({ ...prev, throughputMbps: status.primary.downMbps })),
      () => {},
    )
  }, [])

  return stats
}
