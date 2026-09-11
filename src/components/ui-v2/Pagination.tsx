import { Icon } from './Icon'
import { IconButton } from './IconButton'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <IconButton variant="default" size="sm" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <Icon name="chevron-left" />
      </IconButton>
      <span className="t-label c-tertiary">
        Page {page} of {pageCount}
      </span>
      <IconButton
        variant="default"
        size="sm"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <Icon name="chevron-right" />
      </IconButton>
    </div>
  )
}
