import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Toggle } from '@/components/ui-v2'
import { useToast } from '@/components/ui'
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
    <Card>
      <CardHeader>
        <CardTitle>Network policies</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="policy-list">
          {policies?.map((policy) => (
            <div key={policy.key}>
              <div>
                <p className="t-body c-primary">{policy.label}</p>
                <p className="t-label c-tertiary">{policy.detail}</p>
              </div>
              <Toggle checked={policy.on} onChange={() => toggle(policy.key)} aria-label={policy.label} />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
