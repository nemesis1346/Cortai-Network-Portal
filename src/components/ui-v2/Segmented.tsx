interface SegmentedOption {
  key: string
  label: string
}

interface SegmentedProps {
  options: SegmentedOption[]
  value: string
  onChange: (key: string) => void
  size?: 'sm'
}

export function Segmented({ options, value, onChange, size }: SegmentedProps) {
  return (
    <span className={`segmented${size ? ` segmented--${size}` : ''}`}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className="segmented__btn"
          aria-pressed={opt.key === value}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </span>
  )
}
