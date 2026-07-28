interface BadgeProps {
  label: string
  color?: string
  bg?: string
  className?: string
}

export function Badge({ label, color, bg, className }: BadgeProps) {
  return (
    <span
      className={`tagpill${className ? ` ${className}` : ''}`}
      style={color || bg ? { color, background: bg } : undefined}
    >
      {label}
    </span>
  )
}