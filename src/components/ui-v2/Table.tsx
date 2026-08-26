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
  const gridTemplateColumns = columns.map((c) => c.width ?? '1fr').join(' ')
  return (
    <div className="table">
      <div className="table__head" style={{ gridTemplateColumns }}>
        {columns.map((col) => (
          <div key={col.key} className="th">
            {col.header}
          </div>
        ))}
      </div>
      <div className="table__body">
        {rows.map((row) => (
          <div key={rowKey(row)} className="tr" style={{ gridTemplateColumns }}>
            {columns.map((col) => (
              <div key={col.key} className={col.key === 'actions' ? 'td td--actions' : 'td'}>
                {col.render(row)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
