import type { SelectHTMLAttributes } from 'react'

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
    <div className="fld">
      <label htmlFor={fieldId}>{label}</label>
      <select id={fieldId} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}