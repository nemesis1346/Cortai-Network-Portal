import { useState } from 'react'
import type { TopDestination } from '@/api'
import { Card, CardBody, CardHeader, CardTitle, Segmented } from '@/components/ui-v2'

const RANGE_OPTIONS = [
  { key: '7d', label: '7d' },
  { key: '1m', label: '1m' },
]

interface TopDestinationsCardProps {
  destinations: TopDestination[] | null
  scopeLabel: string | null
}

/**
 * Ported to v2's "Top talkers" donut+legend layout — v2's own "Top talkers"
 * card is domain data (color/category/device-count), a field-for-field match
 * for this app's TopDestination shape, while v2's "Top destinations" card is
 * device data — a match for this app's TopTalker shape (see TopTalkersCard).
 * The two cards' v1 names and v2 layouts are swapped; only the container and
 * title change here, not the underlying `destinations` data.
 */
export function TopDestinationsCard({ destinations, scopeLabel }: TopDestinationsCardProps) {
  const [range, setRange] = useState('7d')

  const gradient = destinations ? buildConicGradient(destinations) : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top talkers</CardTitle>
        {scopeLabel && <span className="badge badge--neutral">{scopeLabel}</span>}
        <span className="spacer" />
        <Segmented size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </CardHeader>
      <CardBody>
        {destinations && (
          <div className="talkers">
            <div className="donut" aria-hidden="true" style={{ background: gradient }} />
            <div className="donut-legend">
              {destinations.map((d) => (
                <div key={d.domain}>
                  <i style={{ background: d.color }} />
                  <b>
                    {d.domain}
                    {d.flag && <span> {d.flag}</span>}
                  </b>
                  <b className="num">{d.gb} Gb</b>
                  <span>{d.category}</span>
                  <span className="num">
                    {d.percent}% · {d.deviceCountOrPeak}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

function buildConicGradient(destinations: TopDestination[]): string {
  let acc = 0
  const stops = destinations.map((d) => {
    const from = acc
    acc += d.percent
    return `${d.color} ${from}% ${acc}%`
  })
  if (acc < 100) {
    stops.push(`var(--color-glass-border-strong) ${acc}% 100%`)
  }
  return `conic-gradient(${stops.join(',')})`
}
