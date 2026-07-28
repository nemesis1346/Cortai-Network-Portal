import type { ReactNode } from 'react'

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
}

export function Table<T>({ columns, rows, rowKey }: TableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  fontSize: 10.5,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  color: 'var(--text-3)',
                  fontWeight: 600,
                  padding: '0 10px 10px',
                  borderBottom: '1px solid var(--line)',
                  width: col.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} style={{ borderBottom: '1px solid var(--line)' }}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: '12px 10px',
                    fontSize: 13,
                    color: 'var(--text)',
                    verticalAlign: 'middle',
                  }}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}