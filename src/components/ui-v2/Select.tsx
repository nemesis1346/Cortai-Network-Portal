import type { SelectHTMLAttributes } from 'react'
import { Icon } from './Icon'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string
  options: SelectOption[]
}

export function Select({ label, options, id, ...rest }: SelectProps) {
  const fieldId = id ?? `sel-${label.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="select-wrap">
        <select id={fieldId} className="input select" {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" />
      </div>
    </div>
  )
}
