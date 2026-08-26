import type { ButtonHTMLAttributes } from 'react'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'md' | 'sm'
  pressed?: boolean
}

export function Chip({ size = 'md', pressed, className, ...rest }: ChipProps) {
  const classes = ['chip', size !== 'md' ? `chip--${size}` : '', className].filter(Boolean).join(' ')
  return <button type="button" className={classes} aria-pressed={pressed} {...rest} />
}
