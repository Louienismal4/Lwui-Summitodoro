import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
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
    <main className="info-page">
      <SiteHeader
        activeView="about"
        onNavigateHome={onNavigateHome}
        onNavigateAbout={() => {}}
        onNavigateChangelog={onNavigateChangelog}
        onStartExpedition={onStartExpedition}
      />

      <section className="info-hero">
        <Badge
          variant="outline"
          className="section-kicker border-transparent px-0 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--coral)] bg-transparent hover:bg-transparent"
        >
          About Summitodoro
        </Badge>
        <h1>Focus is an expedition.</h1>
        <p>
          Summitodoro turns a focused work session into a virtual mountain
          ascent. Your hiker advances as your work time progresses, with
          checkpoint breaks along the way.
        </p>
      </section>

      <section className="info-grid grid-cols-1 md:grid-cols-3" aria-label="How Summitodoro works">
        <Card className="rounded-none border-0 border-b md:border-b-0 md:border-r border-[var(--line)] bg-transparent p-6 sm:p-7 md:p-8 shadow-none flex flex-col justify-start">
          <CardHeader className="p-0 gap-0">
            <span className="text-xs font-extrabold text-[var(--coral)] tracking-[0.12em] mb-3 sm:mb-4">
              01
            </span>
            <CardTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
              Choose a route
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm leading-relaxed text-[#637168]">
            <p>
              Pick a Philippine mountain route and a focus duration that matches
              the task in front of you.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-0 border-b md:border-b-0 md:border-r border-[var(--line)] bg-transparent p-6 sm:p-7 md:p-8 shadow-none flex flex-col justify-start">
          <CardHeader className="p-0 gap-0">
            <span className="text-xs font-extrabold text-[var(--coral)] tracking-[0.12em] mb-3 sm:mb-4">
              02
            </span>
            <CardTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
              Keep moving
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm leading-relaxed text-[#637168]">
            <p>
              The route progresses with your work timer. Checkpoints introduce
              short, automatic recovery breaks before the next push.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-0 bg-transparent p-6 sm:p-7 md:p-8 shadow-none flex flex-col justify-start">
          <CardHeader className="p-0 gap-0">
            <span className="text-xs font-extrabold text-[var(--coral)] tracking-[0.12em] mb-3 sm:mb-4">
              03
            </span>
            <CardTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
              Build your profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm leading-relaxed text-[#637168]">
            <p>
              Sign in to name your hiker, save your climb log, earn coins and
              unlock higher mountain summits across the Philippines.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="info-note border-[var(--line)] border-l-4 border-l-[var(--sun)] bg-[#fffdf7a6] p-5 sm:p-7 md:p-8 shadow-xs mt-6 sm:mt-8 rounded-2xl">
        <CardHeader className="p-0">
          <CardTitle className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
            A productivity map, not a hiking guide
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-w-[760px] text-xs sm:text-sm leading-relaxed text-[#637168]">
          <p>
            Summitodoro routes are simplified OpenStreetMap-derived snapshots
            for a virtual focus experience. They are not real-time navigation,
            trail access, or mountaineering safety recommendations.
          </p>
        </CardContent>
      </Card>

      <SiteFooter />
    </main>
  )
}
