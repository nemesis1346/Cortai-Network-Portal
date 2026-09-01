import { useState } from 'react'
import type { TopTalker } from '@/api'
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Segmented } from '@/components/ui-v2'

const RANGE_OPTIONS = [
  { key: '1d', label: '1d' },
  { key: '1m', label: '1m' },
]

interface TopTalkersCardProps {
  talkers: TopTalker[] | null
}

/**
 * Ported to v2's "Top destinations" dest-row layout — see TopDestinationsCard
 * for why the v1 names and v2 layouts are swapped; this card's own data
 * (device/cluster + magnitude + gb + note) is unchanged.
 */
export function TopTalkersCard({ talkers }: TopTalkersCardProps) {
  const [range, setRange] = useState('1d')
  const max = talkers ? Math.max(...talkers.map((t) => t.magnitude)) : 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top destinations</CardTitle>
        <span className="spacer" />
        <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </CardHeader>
      <CardBody>
        {talkers?.map((t) => (
          <div key={t.label} className="dest-row">
            <b>{t.label}</b>
            <span className="bar">
              <span className="bar__fill" style={{ inlineSize: `${(t.magnitude / max) * 100}%` }} />
            </span>
            <span className="num">{t.gb} Gb</span>
            {t.note_html && <span dangerouslySetInnerHTML={{ __html: t.note_html }} />}
          </div>
        ))}
      </CardBody>
      <CardFooter style={{ borderBlockStart: '1px dashed var(--color-divider)', paddingBlockStart: 'var(--spacing-12)' }}>
        <p className="t-body-sm c-tertiary">
          <b className="c-primary">Reading this:</b> unusual volume from one device is often the first sign of
          misconfiguration, compromise, or shadow IT — we baseline every device and alert on deviation.
        </p>
      </CardFooter>
    </Card>
  )
}
