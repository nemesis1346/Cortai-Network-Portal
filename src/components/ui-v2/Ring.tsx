import type { ReactNode } from 'react'

interface RingProps {
  /** 0-100 */
  value: number
  radius?: number
  strokeWidth?: number
  variant?: 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'grade'
  children: ReactNode
}

export function Ring({ value, radius = 36, strokeWidth = 5, variant, size, children }: RingProps) {
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100)
  // Matches the source's fixed 4px edge-to-circle margin (viewBox 80, r=36 -> box=80).
  const box = radius * 2 + 8
  const center = box / 2

  return (
    <div className={`ring${variant ? ` ring--${variant}` : ''}${size ? ` ring--${size}` : ''}`}>
      <svg viewBox={`0 0 ${box} ${box}`} aria-hidden="true">
        <circle className="ring__track" cx={center} cy={center} r={radius} fill="none" strokeWidth={strokeWidth} />
        <circle
          className="ring__fill"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ring__label num">{children}</span>
    </div>
  )
}
