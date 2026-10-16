import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

type Props = {
  onStartExpedition: () => void
  onNavigateHome: () => void
  onNavigateChangelog: () => void
}

export function AboutPage({
  onStartExpedition,
  onNavigateHome,
  onNavigateChangelog,
}: Props) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_88%_8%,rgba(158,180,154,0.34),transparent_28rem)] bg-cream px-4 sm:px-[clamp(16px,5vw,110px)] pt-6 pb-16 text-ink">
      <SiteHeader
        activeView="about"
        onNavigateHome={onNavigateHome}
        onNavigateAbout={() => {}}
        onNavigateChangelog={onNavigateChangelog}
        onStartExpedition={onStartExpedition}
      />

      <section className="max-w-[1080px] mx-auto mt-12 sm:mt-20 lg:mt-24 mb-10 sm:mb-14">
        <Badge
          variant="outline"
          className="border-transparent px-0 text-[10px] font-extrabold uppercase tracking-[0.18em] text-coral bg-transparent hover:bg-transparent mb-3 block w-fit"
        >
          About Summitodoro
        </Badge>
        <h1 className="font-heading font-bold text-[clamp(36px,7.5vw,82px)] leading-[1.02] tracking-[-0.05em] text-ink-deep break-words m-0">
          Focus is an expedition.
        </h1>
        <p className="text-[#607066] max-w-[630px] mt-4 sm:mt-6 text-[clamp(15px,2.2vw,20px)] leading-[1.6]">
          Summitodoro turns a focused work session into a virtual mountain
          ascent. Your hiker advances as your work time progresses, with
          checkpoint breaks along the way.
        </p>
      </section>

      <section
        className="max-w-[1080px] mx-auto border border-line bg-paper/70 rounded-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-line"
        aria-label="How Summitodoro works"
      >
        <article className="p-6 sm:p-7 md:p-8 flex flex-col min-h-[220px]">
          <span className="text-xs font-extrabold text-coral tracking-[0.12em] mb-3 sm:mb-4">
            01
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-ink-deep mb-2 mt-0">
            Choose a route
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#637168] m-0">
            Pick a Philippine mountain route and a focus duration that matches
            the task in front of you.
          </p>
        </article>

        <article className="p-6 sm:p-7 md:p-8 flex flex-col min-h-[220px]">
          <span className="text-xs font-extrabold text-coral tracking-[0.12em] mb-3 sm:mb-4">
            02
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-ink-deep mb-2 mt-0">
            Keep moving
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#637168] m-0">
            The route progresses with your work timer. Checkpoints introduce
            short, automatic recovery breaks before the next push.
          </p>
        </article>

        <article className="p-6 sm:p-7 md:p-8 flex flex-col min-h-[220px]">
          <span className="text-xs font-extrabold text-coral tracking-[0.12em] mb-3 sm:mb-4">
            03
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-ink-deep mb-2 mt-0">
            Build your profile
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#637168] m-0">
            Sign in to name your hiker, save your climb log, earn coins and
            unlock higher mountain summits across the Philippines.
          </p>
        </article>
      </section>

      <div className="max-w-[1080px] mx-auto mt-7 sm:mt-8 bg-paper/65 border border-line border-l-4 border-l-sun rounded-xl p-6 sm:p-8 shadow-xs">
        <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-ink-deep mb-2 mt-0">
          A productivity map, not a hiking guide
        </h2>
        <p className="max-w-[760px] text-xs sm:text-sm leading-relaxed text-[#637168] m-0">
          Summitodoro routes are simplified OpenStreetMap-derived snapshots
          for a virtual focus experience. They are not real-time navigation,
          trail access, or mountaineering safety recommendations.
        </p>
      </div>

      <SiteFooter />
    </main>
  )
}
