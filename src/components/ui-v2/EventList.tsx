export interface EventListRow {
  time: string
  text_html: string
}

export function EventList({ title, rows }: { title?: string; rows: EventListRow[] }) {
  return (
    <section>
      {title && <p className="section-title">{title}</p>}
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
