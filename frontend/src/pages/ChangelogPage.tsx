import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { RELEASES, type ReleaseCategory } from '@/data/changelog'

type Props = {
  onStartExpedition: () => void
  onNavigateHome: () => void
  onNavigateAbout: () => void
}

const CATEGORY_CONFIG: Record<
  ReleaseCategory,
  { label: string; badgeClass: string; categoryClass: string }
> = {
  added: {
    label: 'Added',
    badgeClass:
      'text-[11px] font-bold uppercase tracking-[0.12em] bg-[#e8f2e8] text-[var(--pine)] rounded px-2 py-0.5 border-0 inline-block mb-2',
    categoryClass: 'release-category release-category-added',
  },
  changed: {
    label: 'Changed',
    badgeClass:
      'text-[11px] font-bold uppercase tracking-[0.12em] bg-[#e9f0f5] text-[#2b5c77] rounded px-2 py-0.5 border-0 inline-block mb-2',
    categoryClass: 'release-category release-category-changed',
  },
  fixed: {
    label: 'Fixed',
    badgeClass:
      'text-[11px] font-bold uppercase tracking-[0.12em] bg-[#fbe9e4] text-[var(--coral)] rounded px-2 py-0.5 border-0 inline-block mb-2',
    categoryClass: 'release-category release-category-fixed',
  },
}

const CATEGORY_KEYS: ReleaseCategory[] = ['added', 'changed', 'fixed']

export function ChangelogPage({
  onStartExpedition,
  onNavigateHome,
  onNavigateAbout,
}: Props) {
  return (
    <main className="info-page">
      <SiteHeader
        activeView="changelog"
        onNavigateHome={onNavigateHome}
        onNavigateAbout={onNavigateAbout}
        onNavigateChangelog={() => {}}
        onStartExpedition={onStartExpedition}
      />

      <section className="info-hero compact">
        <Badge
          variant="outline"
          className="section-kicker border-transparent px-0 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--coral)] bg-transparent hover:bg-transparent"
        >
          Product updates
        </Badge>
        <h1>Changelog</h1>
        <p>Follow the trail of improvements to Summitodoro.</p>
      </section>

      <section className="release-list" aria-label="Release history">
        {RELEASES.map((release) => (
          <Card
            key={release.version}
            className="release-entry border-[var(--line)] bg-[#fffdf7c7] shadow-xs"
          >
            <div>
              <span className="text-xs font-extrabold text-[var(--pine)] tracking-[0.09em] uppercase">
                {release.version}
              </span>
              <small className="text-xs text-[#7a877e]">{release.date}</small>
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-4">
                {release.title}
              </h2>

              {CATEGORY_KEYS.map((key) => {
                const changes = release.categories[key]
                if (!changes || changes.length === 0) return null
                const config = CATEGORY_CONFIG[key]

                return (
                  <section key={key} className={config.categoryClass}>
                    <Badge variant="secondary" className={config.badgeClass}>
                      {config.label}
                    </Badge>
                    <ul>
                      {changes.map((change) => (
                        <li key={change}>{change}</li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          </Card>
        ))}
      </section>

      <SiteFooter />
    </main>
  )
}
