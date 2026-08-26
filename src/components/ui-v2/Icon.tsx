interface IconProps {
  name: string
  className?: string
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}
