import type { SpecRow } from '@/api'

export function SpecGrid({ rows }: { rows: SpecRow[] }) {
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
