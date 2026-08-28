import { useEffect, useState } from 'react'
import { securityApi, type ProtectionStackItem } from '@/api'
import { Badge, Card, CardBody, CardHeader, CardTitle } from '@/components/ui-v2'

export function ProtectionStackCard() {
  const [items, setItems] = useState<ProtectionStackItem[] | null>(null)

  useEffect(() => {
    securityApi.getProtectionStack().then(setItems)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your protection stack</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="stack-list">
          {items?.map((item) => (
            <div key={item.label}>
              <div>
                <b>{item.label}</b>
                <p>{item.detail}</p>
              </div>
              <Badge variant="success" size="sm">
                Active
              </Badge>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
