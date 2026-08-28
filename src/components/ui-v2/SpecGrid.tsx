export interface SpecGridRow {
  label: string
  value: string
  danger?: boolean
}

export function SpecGrid({ rows }: { rows: SpecGridRow[] }) {
  return (
    <dl className="spec">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd className={row.danger ? 'c-danger' : undefined}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
