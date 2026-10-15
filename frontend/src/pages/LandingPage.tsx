import { motion, useReducedMotion } from "motion/react";
import type { MotionProps } from "motion/react";
import { ExpeditionHero } from "@/components/layout/ExpeditionHero";
import { TrailSketch } from "@/components/layout/TrailSketch";
import { CurtainLink } from "@/components/layout/CurtainLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EXPEDITION_MOUNTAINS } from "@/data/expeditionMountains";
import { GEAR_CATALOG, DEFAULT_UNLOCKED_GEAR_IDS } from "@/lib/gear";
import { cn } from "@/lib/utils";

const trailNotes: Record<string, string> = {
  "mt-pinatubo": "Quiet crater waters. A fresh place to begin.",
  "mt-ulap": "Pine-scented ridges. Find your mountain rhythm.",
  "mt-pulag": "An early start. A whole sea of clouds.",
};

const starterGear = GEAR_CATALOG.filter((gear) =>
  ["boots-basic", "pack-basic", "pack-guide", "lamp-headlamp"].includes(
    gear.id,
  ),
);

const steps = [
  {
    title: "Pick your trail",
    sketch: "mountain",
    copy: "Choose a Philippine mountain that calls to you. Every expedition begins with a first step.",
  },
  {
    title: "Set your pace",
    sketch: "clock",
    copy: "Pick a task and a Pomodoro duration. Settle into your work while your hiker follows the trail.",
  },
  {
    title: "Reach the summit",
    sketch: "summit",
    copy: "Take a breather at checkpoints. Finish your focus session and celebrate the ground you’ve covered.",
  },
] as const;

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
  const reduceMotion = useReducedMotion();
  const sectionMotion: MotionProps = {
    initial: reduceMotion ? false : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: "some", margin: "0px 0px -64px 0px" },
    transition: { duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <main className="min-h-screen bg-[#faf7ef] text-ink pb-12">
      <SiteHeader
        activeView="home"
        onNavigateHome={() => {}}
        onNavigateAbout={onNavigateAbout}
        onNavigateChangelog={onNavigateChangelog}
        onStartExpedition={onStartExpedition}
      />
      <ExpeditionHero />

      <motion.section
        {...sectionMotion}
        className="w-[calc(100%-44px)] sm:w-[calc(100%-80px)] max-w-[1080px] mx-auto py-12 sm:py-20 text-ink scroll-mt-7"
        aria-labelledby="trails-heading"
      >
        <div className="max-w-[680px] mx-auto mb-7 sm:mb-12 text-center">
          <p className="font-hand text-xl sm:text-[22px] text-[#345545] mb-4 sm:mb-5">Pick your trail</p>
          <h2 id="trails-heading" className="font-display text-[38px] sm:text-[clamp(36px,4vw,54px)] font-normal leading-[1.08] tracking-[-0.045em] text-balance text-ink">
            Different mountains.
            <br />
            Your own kind of adventure.
          </h2>
          <p className="text-sm leading-[1.8] text-[#53665c] mt-5">
            Start by the crater lake. Work your way toward the clouds.
            <br className="hidden sm:inline" /> There’s a little more of
            the Philippines waiting with every climb.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-5 md:gap-7">
          {EXPEDITION_MOUNTAINS.map((mountain) => (
            <article
              className="flex flex-col"
              key={mountain.id}
            >
              <div className="relative overflow-hidden rounded-xs">
                <img
                  src={`/images/mountains/${mountain.slug.replace("mt-", "")}-illustrated.svg`}
                  alt=""
                  width={320}
                  height={270}
                  loading="lazy"
                  className="w-full h-auto aspect-[1.6] sm:aspect-auto sm:h-[190px] md:h-[230px] object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-paper px-2.5 py-1 text-[11px] rounded-xs font-semibold text-ink shadow-xs">
                  {mountain.isDefaultUnlocked
                    ? "Your first trail"
                    : `Unlock at level ${mountain.requiredLevel}`}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2.5 mt-4 sm:mt-5">
                <h3 className="font-display text-[27px] sm:text-[30px] font-normal leading-[1.15] tracking-[-0.035em] text-ink">{mountain.name}</h3>
                <span className="text-xs whitespace-nowrap text-[#53665c]">{mountain.elevationMasl.toLocaleString("en-US")} m</span>
              </div>
              <p className="my-3 text-[13px] leading-[1.8] text-[#53665c]">{trailNotes[mountain.id]}</p>
              <div className="mt-auto flex items-center justify-between border-t border-ink/15 pt-3.5 text-[11px] text-[#53665c]">
                <span>{mountain.province}</span>
                <span className={cn("px-2.5 py-0.5 rounded-full font-semibold", mountain.slug === "mt-pulag" ? "bg-[#f0dfb9] text-[#345545]" : "bg-[#e4eadb] text-[#345545]")}>
                  {mountain.difficulty === "hard" ? "Challenging" : "Moderate"}
                </span>
              </div>
            </article>
          ))}
        </div>
        <p className="font-hand text-lg sm:text-[19px] leading-relaxed text-center text-[#345545] mt-7 sm:mt-9">
          No boots by the door required. Just a little time for what matters.
        </p>
      </motion.section>

      <motion.section
        {...sectionMotion}
        className="w-[calc(100%-44px)] sm:w-[calc(100%-80px)] max-w-[1080px] mx-auto py-12 sm:py-20 text-ink scroll-mt-7 border-t border-ink/10"
        id="how-it-works"
        aria-labelledby="how-heading"
      >
        <div className="max-w-[680px] mx-auto mb-7 sm:mb-12 text-center">
          <p className="font-hand text-xl sm:text-[22px] text-[#345545] mb-4 sm:mb-5">How it works</p>
          <h2 id="how-heading" className="font-display text-[38px] sm:text-[clamp(36px,4vw,54px)] font-normal leading-[1.08] tracking-[-0.045em] text-balance text-ink">
            Big climbs begin
            <br />
            with small focus sessions.
          </h2>
          <p className="text-sm leading-[1.8] text-[#53665c] mt-5">A familiar Pomodoro rhythm, with a much better view.</p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-5 md:gap-7 p-0 m-0 list-none">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col">
              <div className={cn("relative grid place-items-center h-[170px] sm:h-[200px] mb-5 sm:mb-6 rounded-md", index === 0 ? "bg-[#e4eadb]" : index === 1 ? "bg-[#f1dfae]" : "bg-[#dce7e3]")}>
                <span className="absolute top-4 left-4 text-xs font-mono font-bold text-[#53665c]" aria-hidden="true">0{index + 1}</span>
                <TrailSketch kind={step.sketch} className={cn("size-28 sm:size-32 text-ink", index === 0 ? "-rotate-8" : index === 1 ? "rotate-9" : "")} />
              </div>
              <h3 className="font-display text-[27px] sm:text-[30px] font-normal leading-[1.15] tracking-[-0.035em] text-ink">{step.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.8] text-[#53665c]">{step.copy}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section
        {...sectionMotion}
        className="w-[calc(100%-44px)] sm:w-[calc(100%-80px)] max-w-[1080px] mx-auto py-12 sm:py-20 text-ink scroll-mt-7 border-t border-ink/10 grid grid-cols-1 lg:grid-cols-[0.85fr_1.4fr] gap-9 sm:gap-16 items-center"
        aria-labelledby="rewards-heading"
      >
        <div className="max-w-[560px]">
          <p className="font-hand text-xl sm:text-[22px] text-[#345545] mb-4 sm:mb-5">A few things for the journey</p>
          <h2 id="rewards-heading" className="font-display text-[38px] sm:text-[clamp(36px,4vw,54px)] font-normal leading-[1.08] tracking-[-0.045em] text-balance text-ink">
            Your focus has
            <br />
            something to show for it.
          </h2>
          <p className="text-sm leading-[1.8] text-[#53665c] mt-6">
            Earn experience and Trail Coins as you complete expeditions. Add a
            new piece of gear to your pack, or unlock the mountain you’ve had
            your eye on.
          </p>
          <p className="hidden lg:block font-hand text-[23px] leading-[1.4] text-[#345545] -rotate-4 mt-7">
            Little souvenirs.
            <br />
            Well-earned adventures.
          </p>
        </div>
        <div>
          <p className="text-xs text-[#53665c] mb-4">
            A peek at your starter collection
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {starterGear.map((gear) => {
              const unlocked = DEFAULT_UNLOCKED_GEAR_IDS.includes(gear.id);
              return (
                <figure
                  className={cn("m-0 p-3.5 sm:p-4 text-center rounded-sm transition-colors", unlocked ? "bg-[#e6ebd9]" : "bg-[#f0eee0]")}
                  key={gear.id}
                >
                  <div className={cn("grid place-items-center h-[94px] mb-3", !unlocked && "brightness-0 opacity-28")}>
                    <TrailSketch
                      kind={
                        gear.category === "footwear"
                          ? "boots"
                          : gear.category === "lamp"
                            ? "lamp"
                            : "pack"
                      }
                      className="size-[88px] text-ink"
                    />
                  </div>
                  <figcaption className="grid gap-1.5">
                    <strong className="text-xs font-semibold leading-snug min-h-[35px] text-ink">{gear.name}</strong>
                    <span className="text-[10px] text-[#53665c]">
                      {unlocked
                        ? "Unlocked · starter gear"
                        : `Locked · level ${gear.levelRequired}`}
                    </span>
                    {!unlocked && <small className="text-[10px] text-[#53665c]">{gear.coinsCost} Trail Coins</small>}
                  </figcaption>
                </figure>
              );
            })}
            {EXPEDITION_MOUNTAINS.filter(
              (mountain) => !mountain.isDefaultUnlocked,
            ).map((mountain) => (
              <figure className="m-0 p-3.5 sm:p-4 text-center rounded-sm bg-[#f0eee0]" key={mountain.id}>
                <div className="grid place-items-center h-[94px] mb-3 brightness-0 opacity-28">
                  <TrailSketch
                    kind={mountain.id === "mt-pulag" ? "summit" : "mountain"}
                    className="size-[88px] text-ink"
                  />
                </div>
                <figcaption className="grid gap-1.5">
                  <strong className="text-xs font-semibold leading-snug min-h-[35px] text-ink">{mountain.name}</strong>
                  <span className="text-[10px] text-[#53665c]">Locked · level {mountain.requiredLevel}</span>
                  <small className="text-[10px] text-[#53665c]">{mountain.unlockCost} Trail Coins</small>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        {...sectionMotion}
        className="w-[calc(100%-44px)] sm:w-[calc(100%-80px)] max-w-[1080px] mx-auto py-12 sm:py-20 text-ink scroll-mt-7 border-t border-ink/10 grid grid-cols-1 md:grid-cols-2 gap-9 sm:gap-20 md:gap-24 items-center"
        aria-labelledby="together-heading"
      >
        <figure className="mx-2 sm:mx-3 p-3 pb-4.5 bg-paper shadow-[0_7px_20px_rgba(41,68,44,0.09)] -rotate-4 transition-transform duration-350 hover:-rotate-1 hover:-translate-y-1">
          <img
            src="/images/mountains/trail-buddies.svg"
            alt="Two backpackers sharing a winding mountain trail"
            width={420}
            height={300}
            loading="lazy"
            className="block w-full h-auto"
          />
          <figcaption className="pt-4 font-hand text-lg sm:text-[22px] leading-tight text-[#345545]">
            Some summits are sweeter together.
          </figcaption>
        </figure>
        <div>
          <p className="font-hand text-xl sm:text-[22px] text-[#345545] mb-4 sm:mb-5">Climb together</p>
          <h2 id="together-heading" className="font-display text-[38px] sm:text-[clamp(36px,4vw,54px)] font-normal leading-[1.08] tracking-[-0.045em] text-balance text-ink">
            Your own pace.
            <br />A little good company.
          </h2>
          <span className="inline-block mt-5 px-2.5 py-1 rounded-full bg-[#f1dfae] text-[11px] font-bold text-ink-deep">
            Coming soon
          </span>
          <p className="text-sm leading-[1.8] text-[#53665c] mt-5">
            Cooperative focus expeditions are on the horizon. Bring your trail
            buddies, settle into your own tasks, and work toward a shared
            summit.
          </p>
          <p className="text-sm leading-[1.8] text-[#53665c] mt-5">
            A little accountability. Someone to cheer you on.
            <br />A sunrise worth sharing.
          </p>
        </div>
      </motion.section>

      <motion.section
        {...sectionMotion}
        className="w-[calc(100%-44px)] sm:w-[calc(100%-80px)] max-w-[1080px] mx-auto pt-20 pb-16 sm:py-24 text-center border-t border-ink/10 flex flex-col items-center"
        aria-labelledby="final-heading"
      >
        <TrailSketch kind="summit" className="size-[88px] mx-auto mb-6 -rotate-8 text-ink" />
        <p className="font-hand text-xl sm:text-[22px] text-[#345545] mb-4">The trail starts right here</p>
        <h2 id="final-heading" className="font-display text-[38px] sm:text-[clamp(36px,4vw,54px)] font-normal leading-[1.08] tracking-[-0.045em] text-balance text-ink">
          One task. One small step.
          <br />
          See where it takes you.
        </h2>
        <CurtainLink
          to="/hike"
          className="mt-7 w-auto inline-flex min-h-[52px] items-center justify-center px-7 rounded-full border border-ink bg-ink text-paper text-sm font-bold tracking-[0.04em] transition-all duration-160 hover:bg-[#37634e] hover:border-[#37634e] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-3 focus-visible:outline-ink focus-visible:outline-offset-4"
        >
          Start a focus expedition
        </CurtainLink>
        <p className="text-xs text-[#53665c] mt-4.5">Your next summit starts with a little focus.</p>
      </motion.section>

      <footer className="max-w-[1200px] w-[calc(100%-44px)] sm:w-[calc(100%-80px)] mx-auto border-t border-ink/15 pt-7 text-[#53665c]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <CurtainLink to="/" className="font-display text-2xl sm:text-[28px] leading-tight text-ink hover:underline">
              Summitodoro
            </CurtainLink>
            <p className="text-xs text-[#53665c] mt-2">Focus is an expedition.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex items-center gap-6 text-xs">
            <CurtainLink to="/hike" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              Expedition
            </CurtainLink>
            <CurtainLink to="/about" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              About
            </CurtainLink>
            <CurtainLink to="/changelog" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              Changelog
            </CurtainLink>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-5 mt-7 text-[10px] leading-relaxed text-[#53665c]/80">
          <small>
            A virtual experience, not real-world navigation or safety guidance.
          </small>
          <small>© {new Date().getFullYear()} Summitodoro</small>
        </div>
      </footer>
    </main>
  );
}
