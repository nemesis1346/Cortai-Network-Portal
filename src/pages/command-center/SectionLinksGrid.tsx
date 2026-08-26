import type { HomeHealth } from '@/api'
import { Alert, StatCard } from '@/components/ui-v2'

interface SectionLinksGridProps {
  health: HomeHealth | null
  error: string | null
  onNavigate: (tab: string) => void
}

export function SectionLinksGrid({ health, error, onNavigate }: SectionLinksGridProps) {
  if (error) {
    return <Alert variant="danger" title="Section status unavailable" description={error} />
  }

  return (
    <div className="grid-2" style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
      {(health?.sections ?? []).map((section) => (
        <StatCard
          key={section.key}
          compact
          title={section.label}
          value={section.stat}
          trend={section.trend}
          label={<span dangerouslySetInnerHTML={{ __html: section.sub_html }} />}
          onClick={() => onNavigate(section.tab)}
        />
      ))}
    </div>
  )
}
