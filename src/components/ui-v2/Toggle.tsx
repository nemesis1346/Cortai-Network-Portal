interface ToggleProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  'aria-label'?: string
}

export function Toggle({ checked, onChange, disabled, 'aria-label': ariaLabel }: ToggleProps) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} aria-label={ariaLabel} />
      <span className="toggle__track" />
    </label>
  )
}
