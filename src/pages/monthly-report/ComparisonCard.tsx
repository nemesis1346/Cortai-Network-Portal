import type { ReportComparisonRow } from '@/api'

interface ComparisonCardProps {
  comparison: ReportComparisonRow[]
}

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  return (
    <div className="card">
      <h3>Why this is different</h3>
      <table className="cmp">
        <thead>
          <tr>
            <th />
            <th className="us">COrtai Managed</th>
            <th>Typical telco</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td className="us">
                <span className="y">✓</span> {row.us}
              </td>
              <td>
                <span className="n">✗</span> {row.telco}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
