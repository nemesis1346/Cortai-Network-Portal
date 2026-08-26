interface AvatarProps {
  initials: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
}

export function Avatar({ initials, name, size, online }: AvatarProps) {
  return (
    <span className={`avatar${size ? ` avatar--${size}` : ''}`} title={name}>
      {initials}
      {online !== undefined && <span className={`avatar__status${online ? ' avatar__status--online' : ''}`} />}
    </span>
  )
}
