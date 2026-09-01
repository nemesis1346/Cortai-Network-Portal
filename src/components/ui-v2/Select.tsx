import type { SelectHTMLAttributes } from 'react'
import { Icon } from './Icon'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'size'> {
  /** Omit for a bare select in a field-row — visible field labels are opt-in, not automatic. */
  label?: string
  size?: 'sm'
  options: SelectOption[]
}

export function Select({ label, size, options, id, ...rest }: SelectProps) {
  const fieldId = id ?? (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)
  const select = (
    <div className="select-wrap">
      <select
        id={fieldId}
        className={`input select${size ? ` input--${size}` : ''}`}
        aria-label={label ? undefined : 'Select'}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" />
    </div>
  )

  if (!label) return select

  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      {select}
    </div>
  )
}
