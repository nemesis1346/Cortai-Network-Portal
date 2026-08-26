import type { ReactNode } from 'react'

interface FeedItemProps {
  icon: ReactNode
  title: ReactNode
  meta: ReactNode
  trailing?: ReactNode
  onClick?: () => void
}

export function FeedItem({ icon, title, meta, trailing, onClick }: FeedItemProps) {
  const inner = (
    <>
      {icon}
      <span className="feed__main">
        <span className="feed__title">{title}</span>
        <span className="feed__meta">{meta}</span>
      </span>
      {trailing}
    </>
  )

  if (onClick) {
    return (
      <div className="feed__item" onClick={onClick} style={{ cursor: 'pointer' }}>
        {inner}
      </div>
    )
  }
  return <div className="feed__item">{inner}</div>
}
