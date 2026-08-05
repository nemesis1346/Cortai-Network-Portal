import { useEffect, useState } from 'react'
import { Toggle, useToast } from '@/components/ui'
import { controlsApi, type PolicyToggle } from '@/api'

interface NetworkPoliciesCardProps {
  onChanged: () => void
}

export function NetworkPoliciesCard({ onChanged }: NetworkPoliciesCardProps) {
  const [policies, setPolicies] = useState<PolicyToggle[] | null>(null)
  const { show: showToast } = useToast()

  useEffect(() => {
    controlsApi.listPolicies().then(setPolicies)
  }, [])

  const toggle = (key: string) => {
    controlsApi.togglePolicy(key).then((result) => {
      setPolicies((prev) => prev?.map((p) => (p.key === key ? result.policy : p)) ?? null)
      showToast(result.outcomeMessage)
      onChanged()
    })
  }

  return (
    <div className="card">
      <h3>Network policies</h3>
      {policies?.map((policy, i) => (
        <Toggle
          key={policy.key}
          label={policy.label}
          detail={policy.detail}
          checked={policy.on}
          onChange={() => toggle(policy.key)}
          last={i === policies.length - 1}
        />
      ))}
    </div>
  )
}
