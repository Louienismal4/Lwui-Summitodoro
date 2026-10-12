import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type Props = {
  onStartExpedition: () => void;
  onNavigateAbout?: () => void;
  onNavigateChangelog?: () => void;
};

export function LandingPage({
  onStartExpedition,
  onNavigateAbout = () => {},
  onNavigateChangelog = () => {},
}: Props) {
  return (
    <main className="info-page seo-home">
      {/* Responsive Header */}
      <SiteHeader
        activeView="home"
        onNavigateHome={() => {}}
        onNavigateAbout={onNavigateAbout}
        onNavigateChangelog={onNavigateChangelog}
        onStartExpedition={onStartExpedition}
      />

      {/* Hero Section - Optimized for Mobile & Desktop */}
      <section className="info-hero seo-home-hero">
        <Badge
          variant="outline"
          className="section-kicker border-transparent px-0 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--coral)] bg-transparent hover:bg-transparent"
        >
          Gamified Pomodoro focus timer
        </Badge>
        <h1>Summitodoro turns focus time into a mountain climb.</h1>
        <p>
          Choose a Philippine mountain, start a focused work session, and watch
          your virtual hiker advance toward the summit as you stay on task.
        </p>
        {/* Action Buttons - Full-width on mobile, auto on desktop */}
        <div className="seo-home-actions">
          <Button
            size="lg"
            className="primary-button large cursor-pointer text-xs font-extrabold tracking-wide w-full sm:w-auto"
            onClick={onStartExpedition}
          >
            Start a focus expedition <span aria-hidden="true">→</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="secondary-button large cursor-pointer text-xs font-extrabold tracking-wide w-full sm:w-auto"
            onClick={onNavigateAbout}
          >
            How Summitodoro works
          </Button>
        </div>
      </section>

      {/* 3-Step Feature Grid - Seamless borders on both mobile stack & desktop row */}
      <section
        className="info-grid grid-cols-1 md:grid-cols-3"
        aria-label="Summitodoro features"
      >
        <Card className="rounded-none border-0 border-b md:border-b-0 md:border-r border-[var(--line)] bg-transparent p-6 sm:p-7 md:p-8 shadow-none flex flex-col justify-start">
          <CardHeader className="p-0 gap-0">
            <span className="text-xs font-extrabold text-[var(--coral)] tracking-[0.12em] mb-3 sm:mb-4">
              01
            </span>
            <CardTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
              Pick your trail
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm leading-relaxed text-[#637168]">
            <p>
              Focus across virtual routes inspired by Mt. Pinatubo, Mt. Ulap,
              and Mt. Pulag in the Philippines.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-0 border-b md:border-b-0 md:border-r border-[var(--line)] bg-transparent p-6 sm:p-7 md:p-8 shadow-none flex flex-col justify-start">
          <CardHeader className="p-0 gap-0">
            <span className="text-xs font-extrabold text-[var(--coral)] tracking-[0.12em] mb-3 sm:mb-4">
              02
            </span>
            <CardTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
              Set your pace
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm leading-relaxed text-[#637168]">
            <p>
              Choose a Pomodoro duration, plan your task, and let checkpoints
              divide the climb into manageable focus blocks.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-0 bg-transparent p-6 sm:p-7 md:p-8 shadow-none flex flex-col justify-start">
          <CardHeader className="p-0 gap-0">
            <span className="text-xs font-extrabold text-[var(--coral)] tracking-[0.12em] mb-3 sm:mb-4">
              03
            </span>
            <CardTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
              Reach the summit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm leading-relaxed text-[#637168]">
            <p>
              Complete sessions to build your hiker profile, earn rewards, and
              share cooperative focus expeditions with friends.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Disclaimer / Note Card */}
      <Card className="info-note border-[var(--line)] border-l-4 border-l-[var(--sun)] bg-[#fffdf7a6] p-5 sm:p-7 md:p-8 shadow-xs mt-6 sm:mt-8 rounded-2xl">
        <CardHeader className="p-0">
          <CardTitle className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[var(--ink-deep)] mb-2">
            Built for focused work, not real-world navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-w-[760px] text-xs sm:text-sm leading-relaxed text-[#637168]">
          <p>
            Summitodoro uses simplified trail snapshots as a virtual
            productivity experience. Routes are not live hiking, access, or
            safety guidance.
          </p>
        </CardContent>
      </Card>

      {/* Responsive Footer */}
      <SiteFooter />
    </main>
  );
}
