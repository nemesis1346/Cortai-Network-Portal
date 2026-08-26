import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'danger-glyph'
  size?: 'md' | 'sm' | 'xs'
  'aria-label': string
}

export function IconButton({ variant = 'default', size = 'md', className, ...rest }: IconButtonProps) {
  const classes = [
    'icon-btn',
    variant !== 'default' ? `icon-btn--${variant}` : '',
    size !== 'md' ? `icon-btn--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return <button className={classes} {...rest} />
}
