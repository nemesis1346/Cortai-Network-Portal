import { useEffect, useState } from 'react'
import { securityApi, type ProtectionStackItem } from '@/api'

export function ProtectionStackCard() {
  const [items, setItems] = useState<ProtectionStackItem[] | null>(null)

  useEffect(() => {
    securityApi.getProtectionStack().then(setItems)
  }, [])

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <h3>Your protection stack</h3>
      {items?.map((item) => (
        <div key={item.label} className="stack-row">
          <div className="tick">✓</div>
          <div>
            {item.label}
            <div className="sub">{item.detail}</div>
          </div>
          <div className="ok">ACTIVE</div>
        </div>
      ))}
    </div>
  )
}
