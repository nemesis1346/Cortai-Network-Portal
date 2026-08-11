import type { TopTalker } from '@/api'

interface TopTalkersCardProps {
  talkers: TopTalker[] | null
}

export function TopTalkersCard({ talkers }: TopTalkersCardProps) {
  const max = talkers ? Math.max(...talkers.map((t) => t.magnitude)) : 1

  return (
    <div className="card">
      <h3>Top talkers · 30d</h3>
      {talkers?.map((t) => (
        <div key={t.label} className="geo-row">
          <span className="name">{t.label}</span>
          <div className="bar">
            <i style={{ width: `${(t.magnitude / max) * 100}%`, background: 'var(--wired)' }} />
          </div>
          <span className="n mono-num">{t.gb} GB</span>
          {t.note_html && <span className="text-3" dangerouslySetInnerHTML={{ __html: t.note_html }} />}
        </div>
      ))}
      <div className="gov-note">
        <b>Reading this:</b> unusual volume from one device is often the first sign of misconfiguration, compromise,
        or shadow IT — we baseline every device and alert on deviation.
      </div>
    </div>
  )
}
