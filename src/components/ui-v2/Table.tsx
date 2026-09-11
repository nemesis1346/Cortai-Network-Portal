import type { ReactNode } from 'react'
import { Icon } from './Icon'

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
  sortable?: boolean
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

export function Table<T>({ columns, rows, rowKey, sortKey, sortDirection, onSort }: TableProps<T>) {
  const gridTemplateColumns = columns.map((c) => c.width ?? '1fr').join(' ')
  return (
    <div className="table">
      <div className="table__head" style={{ gridTemplateColumns }}>
        {columns.map((col) =>
          col.sortable ? (
            <button key={col.key} type="button" className="th th--sortable" onClick={() => onSort?.(col.key)}>
              {col.header}
              {sortKey === col.key && <Icon name={sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'} />}
            </button>
          ) : (
            <div key={col.key} className="th">
              {col.header}
            </div>
          ),
        )}
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
