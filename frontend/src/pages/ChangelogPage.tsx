import { Badge } from '@/components/ui/badge'
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
  { label: string; badgeClass: string }
> = {
  added: {
    label: 'Added',
    badgeClass:
      'text-[11px] font-bold uppercase tracking-[0.12em] bg-[#e8f2e8] text-pine rounded px-2 py-0.5 border-0 inline-block mb-2',
  },
  changed: {
    label: 'Changed',
    badgeClass:
      'text-[11px] font-bold uppercase tracking-[0.12em] bg-[#e9f0f5] text-[#2b5c77] rounded px-2 py-0.5 border-0 inline-block mb-2',
  },
  fixed: {
    label: 'Fixed',
    badgeClass:
      'text-[11px] font-bold uppercase tracking-[0.12em] bg-[#fbe9e4] text-coral rounded px-2 py-0.5 border-0 inline-block mb-2',
  },
}

const CATEGORY_KEYS: ReleaseCategory[] = ['added', 'changed', 'fixed']

export function ChangelogPage({
  onStartExpedition,
  onNavigateHome,
  onNavigateAbout,
}: Props) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_88%_8%,rgba(158,180,154,0.34),transparent_28rem)] bg-cream px-4 sm:px-[clamp(16px,5vw,110px)] pt-6 pb-16 text-ink">
      <SiteHeader
        activeView="changelog"
        onNavigateHome={onNavigateHome}
        onNavigateAbout={onNavigateAbout}
        onNavigateChangelog={() => {}}
        onStartExpedition={onStartExpedition}
      />

      <section className="max-w-[1080px] mx-auto mt-12 sm:mt-16 mb-8 sm:mb-11">
        <Badge
          variant="outline"
          className="border-transparent px-0 text-[10px] font-extrabold uppercase tracking-[0.18em] text-coral bg-transparent hover:bg-transparent mb-3 block w-fit"
        >
          Product updates
        </Badge>
        <h1 className="font-heading font-bold text-[clamp(36px,7.5vw,82px)] leading-[1.02] tracking-[-0.05em] text-ink-deep break-words m-0">
          Changelog
        </h1>
        <p className="text-[#607066] max-w-[630px] mt-4 sm:mt-6 text-[clamp(15px,2.2vw,20px)] leading-[1.6]">
          Follow the trail of improvements to Summitodoro.
        </p>
      </section>

      <section className="max-w-[1080px] mx-auto flex flex-col gap-4 sm:gap-5" aria-label="Release history">
        {RELEASES.map((release) => (
          <div
            key={release.version}
            className="border border-line bg-paper/80 rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-[150px_1fr] gap-3 sm:gap-8 shadow-xs"
          >
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-xs font-extrabold text-pine tracking-[0.09em] uppercase">
                {release.version}
              </span>
              <small className="text-xs text-[#7a877e]">{release.date}</small>
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-ink-deep mb-4 mt-0">
                {release.title}
              </h2>

              {CATEGORY_KEYS.map((key) => {
                const changes = release.categories[key]
                if (!changes || changes.length === 0) return null
                const config = CATEGORY_CONFIG[key]

                return (
                  <section key={key} className="mt-4 first:mt-0">
                    <span className={config.badgeClass}>
                      {config.label}
                    </span>
                    <ul className="mt-2 pl-4 list-disc space-y-1">
                      {changes.map((change) => (
                        <li key={change} className="text-sm leading-relaxed text-[#637168]">
                          {change}
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <SiteFooter />
    </main>
  )
}
