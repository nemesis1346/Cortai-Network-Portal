interface ToggleProps {
  label: string
  detail?: string
  checked: boolean
  onChange: () => void
  /** Omits the row's bottom border — pass true on the last item in a list. */
  last?: boolean
}

export function Toggle({ label, detail, checked, onChange, last }: ToggleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '13px 2px',
        borderBottom: last ? 'none' : '1px solid var(--line)',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</div>
        {detail && <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2, lineHeight: 1.45 }}>{detail}</div>}
      </div>
      <button
        onClick={onChange}
        aria-pressed={checked}
        aria-label={label}
        style={{
          width: 40,
          height: 22,
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: 2,
          padding: 0,
          background: checked ? 'var(--wired)' : 'var(--line-2)',
          position: 'relative',
          transition: 'background .18s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: checked ? '#04241b' : 'var(--text-2)',
            transition: 'left .18s',
          }}
        />
      </button>
    </div>
  )
}
