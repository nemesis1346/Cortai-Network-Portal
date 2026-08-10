import { useEffect, useState } from 'react'
import { securityApi, type AttackOrigin } from '@/api'

export function AttackOriginsCard() {
  const [origins, setOrigins] = useState<AttackOrigin[] | null>(null)

  useEffect(() => {
    securityApi.getAttackOrigins().then(setOrigins)
  }, [])

  return (
    <div className="card">
      <h3>Attack origins · 30d</h3>
      {origins?.map((origin) => (
        <div key={origin.country} className="geo-row">
          <span className="name">{origin.country}</span>
          <div className="bar">
            <i style={{ width: `${origin.bar_percent}%`, opacity: origin.country === 'Other' ? 0.4 : undefined }} />
          </div>
          <span className="n mono-num">{origin.count}</span>
        </div>
      ))}
    </div>
  )
}
