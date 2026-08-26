import type { EventRow } from '@/api'

export function EventList({ title, rows }: { title: string; rows: EventRow[] }) {
  return (
    <section>
      <p className="section-title">{title}</p>
      <div className="events">
        {rows.map((row, i) => (
          <div key={i}>
            <time>{row.time}</time>
            <p dangerouslySetInnerHTML={{ __html: row.text_html }} />
          </div>
        ))}
      </div>
    </section>
  )
}
