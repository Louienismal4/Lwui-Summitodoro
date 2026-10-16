import { CurtainLink } from "@/components/layout/CurtainLink";
import { EXPEDITION_MOUNTAINS } from "@/data/expeditionMountains";
import { TrailSketch } from "@/components/layout/TrailSketch";
import { cn } from "@/lib/utils";

export function ExpeditionHero() {
  return (
    <section className="overflow-hidden pb-10 text-ink" aria-labelledby="expedition-hero-heading">
      <div className="relative z-1 max-w-[1200px] mx-auto pt-7 sm:pt-11 px-6 text-center">
        <TrailSketch
          kind="mountain"
          className="hidden lg:block absolute w-[65px] xl:w-[105px] top-[27px] xl:top-[117px] left-[6%] xl:left-[2%] -rotate-12 pointer-events-none text-ink"
        />

        <p className="font-hand text-[19px] sm:text-[23px] text-[#345545] -rotate-3 mb-5 sm:mb-[22px] motion-safe:animate-arrive">
          Focus is an expedition
        </p>

        <h1
          id="expedition-hero-heading"
          className="font-display font-normal text-[clamp(40px,11.5vw,64px)] sm:text-[clamp(42px,5.1vw,74px)] leading-[1.06] sm:leading-[1.04] tracking-[-0.055em] text-balance max-w-[840px] mx-auto text-ink motion-safe:animate-arrive motion-safe:[animation-delay:80ms]"
        >
          Summitodoro turns focus time{" "}
          <em className="relative block w-fit mx-auto font-normal not-italic after:content-[''] after:absolute after:h-[6px] sm:after:h-[9px] after:left-[2%] after:right-0 after:-bottom-[7px] sm:after:-bottom-[10px] after:border-t-2 sm:after:border-t-[3px] after:border-t-[#dfac50] after:border-b after:border-b-[#dfac50] after:rounded-[50%] after:-rotate-1 motion-safe:after:animate-underline motion-safe:after:origin-left">
            into a mountain climb
          </em>
        </h1>

        <div
          className="hidden xl:block absolute top-[134px] right-[1%] font-hand text-[21px] leading-[1.2] rotate-9 text-[#345545] select-none"
          aria-hidden="true"
        >
          <TrailSketch kind="clock" className="w-[70px] mx-auto -mt-16 mb-3 -rotate-15" />
          Small steps.<br />Big summits.
          <svg viewBox="0 0 70 66" fill="none" className="w-[60px] mx-auto mt-1 text-[#345545]">
            <path d="M10 5c37 0 45 20 24 49m-9-14 7 17 18-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="max-w-[360px] sm:max-w-[540px] mx-auto mt-6 sm:mt-7 text-sm sm:text-[15px] leading-[1.7] sm:leading-[1.75] text-[#53665c] text-pretty motion-safe:animate-arrive motion-safe:[animation-delay:160ms]">
          Pick a Philippine mountain. Put a little time into what matters.
          Every focused session brings your hiker closer to a summit sunrise.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-[26px] mt-6 sm:mt-7 motion-safe:animate-arrive motion-safe:[animation-delay:240ms]">
          <CurtainLink
            to="/hike"
            className="w-full sm:w-auto max-w-[330px] sm:max-w-none inline-flex min-h-[52px] items-center justify-center px-[26px] rounded-full border border-ink bg-ink text-paper text-sm font-bold tracking-[0.04em] transition-all duration-160 hover:bg-[#37634e] hover:border-[#37634e] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-3 focus-visible:outline-ink focus-visible:outline-offset-4"
          >
            Start a focus expedition
          </CurtainLink>
          <a
            href="#how-it-works"
            className="inline-flex min-h-[44px] sm:min-h-[52px] items-center justify-center gap-3 px-2 rounded-md text-[#345545] text-[13px] sm:text-sm font-bold transition-all duration-160 hover:bg-[#e9ede1] focus-visible:outline-3 focus-visible:outline-ink focus-visible:outline-offset-4 group"
          >
            How it works{" "}
            <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true">
              ↘
            </span>
          </a>
        </div>

        <p className="mt-2 sm:mt-[18px] text-[11px] sm:text-xs text-[#637063] motion-safe:animate-arrive motion-safe:[animation-delay:320ms]">
          One task. One trail. Your own pace.
        </p>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4 items-start max-w-[1120px] w-[calc(100%-36px)] sm:w-[calc(100%-100px)] mx-auto mt-11 sm:mt-[70px] mb-6 px-1 sm:px-2.5 gap-6 sm:gap-2"
        aria-label="A few keepsakes from your next expedition"
      >
        {EXPEDITION_MOUNTAINS.map((mountain) => {
          const isPinatubo = mountain.id === "mt-pinatubo";
          const isUlap = mountain.id === "mt-ulap";
          const isPulag = mountain.id === "mt-pulag";

          return (
            <figure
              key={mountain.id}
              className={cn(
                "relative min-w-0 p-2 sm:p-2.5 pb-3 sm:pb-4 bg-paper shadow-[0_7px_16px_rgba(41,68,44,0.09)] motion-safe:animate-postcard transition-transform duration-250 ease-out hover:-translate-y-2 hover:rotate-2",
                isPinatubo && "order-1 mt-2.5 sm:mt-4 -rotate-5 sm:-rotate-7 motion-safe:[animation-delay:250ms]",
                isUlap && "order-3 mt-2 sm:mt-[22px] -rotate-4 sm:-rotate-5 motion-safe:[animation-delay:450ms]",
                isPulag && "order-4 mt-0 rotate-5 sm:rotate-7 motion-safe:[animation-delay:550ms]",
              )}
            >
              <img
                src={`/images/mountains/${mountain.slug.replace("mt-", "")}-illustrated.svg`}
                alt={`Illustrated ${mountain.name} ${
                  isPinatubo
                    ? "crater lake"
                    : isUlap
                      ? "pine ridges"
                      : "sunrise above the clouds"
                }`}
                width={320}
                height={270}
                className="block w-full h-auto aspect-[32/27] object-cover"
              />
              <figcaption className="grid gap-1 sm:gap-1.5 pt-2.5 sm:pt-3 px-0.5 sm:px-1 text-[#345545]">
                <span className="font-hand text-lg sm:text-[22px] leading-tight">{mountain.name}</span>
                <small className="text-[10px] leading-normal">
                  {mountain.elevationMasl.toLocaleString("en-US")} m above the everyday
                </small>
              </figcaption>
            </figure>
          );
        })}

        <figure
          className="order-2 z-1 mt-0 bg-[#f4dfa1] rotate-4 relative min-w-0 p-2 sm:p-2.5 pb-3 sm:pb-4 shadow-[0_7px_16px_rgba(41,68,44,0.09)] motion-safe:animate-postcard motion-safe:[animation-delay:350ms] transition-transform duration-250 ease-out hover:-translate-y-2 hover:rotate-2 before:content-[''] before:absolute before:-top-2.5 before:left-1/3 before:z-2 before:w-[60px] sm:before:w-[80px] before:h-5 sm:before:h-6 before:bg-[#e9dba8b3] before:-rotate-8"
          aria-label="Illustrated preview of a focus expedition on Mt. Pulag"
        >
          <div className="relative aspect-[32/27] isolate">
            <div className="absolute inset-0 overflow-hidden -z-1">
              <svg
                className="absolute inset-0 w-full h-full -z-1"
                viewBox="550 0 650 480"
                fill="none"
                preserveAspectRatio="xMidYMax slice"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="hero-sky" x1="720" y1="0" x2="720" y2="480" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#faf7ef" />
                    <stop offset="0.65" stopColor="#e4ece6" />
                    <stop offset="1" stopColor="#b8d0c7" />
                  </linearGradient>
                  <linearGradient id="hero-ridge" x1="920" y1="180" x2="920" y2="480" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#729784" />
                    <stop offset="1" stopColor="#426b56" />
                  </linearGradient>
                  <symbol id="hero-pine" viewBox="0 0 48 108">
                    <path d="M23 74h4v34h-4z" fill="#274e40" />
                    <path d="M25 0 9 31h8L3 54h11L0 80q24 8 48 0L34 54h10L30 31h9z" fill="currentColor" />
                    <path d="m25 6-2 72-15 3 10-25h-8l12-24h-7z" fill="#ffffff" opacity=".07" />
                  </symbol>
                </defs>
                <path fill="url(#hero-sky)" d="M0 0h1440v480H0z" />
                <circle cx="1105" cy="120" r="70" fill="#f6d599" opacity=".3" />
                <circle cx="1105" cy="120" r="48" fill="#efb762" />
                <path d="m0 187 86-43 52 24 108-94 44 37 39-17 104 92 94-45 67 39 119-80 80 49 56-20 107 69 110-55 51 28 95-94 49 45 65-7 119 82v283H0Z" fill="#c3d5d0" />
                <path d="m0 242 126-58 84 35 146-80 67 27 103-58 45 36 64-11 117 101 91-60 67 30 125-89 65 50 48-15 69 48 80-27 143 74v225H0Z" fill="#9ebbb4" />
                <path d="m526 108 45 36 64-11 117 101-120-55-25 5-29-35-18 14zM1035 115l65 50 48-15 69 48-84-22-41 6-20-35z" fill="#dce3d4" opacity=".55" />
                <g className="motion-safe:animate-cloud-drift fill-[#f5f6ec] opacity-72">
                  <path d="M-100 230c115-33 186 13 303-8s175-25 278 0 221-14 301 5c-128 28-208 11-315 25S149 245 48 262s-140 1-148-32Z" />
                  <path d="M815 187c84-19 141 6 216-4s175-27 254-6 159 10 225 2v28c-105 6-158-7-244 3s-181-3-260 3-141-2-191-26Z" />
                  <path d="M269 279c145-14 221 18 335 0s187-4 299 6 216-19 346-5c-73 30-198 11-308 23s-193-8-314 4-257 0-358-28Z" />
                </g>
                <path d="M0 337c97-27 153-79 232-69s128 70 222 73 178-37 276-65 138-100 235-91 147 110 245 116 155-38 230-17v196H0Z" fill="url(#hero-ridge)" />
                <path d="M730 276c98-28 138-100 235-91 40 4 78 25 109 49-65-21-97-33-144-17-65 23-76 46-122 57s-52 3-78 2Z" fill="#c6c58d" />
                <path d="M0 385c122-73 188-55 297-3s195 26 319 3 212-57 307-46 154 53 239 20 183-16 278 9v112H0Z" fill="#315e4d" />
                <path d="M1440 451c-118-23-156-39-264-35s-208-24-213-49 83-32 69-52c-10-16-72-19-60-38s46-27 24-40c-7-4-17-8-26-12 37 8 57 21 37 35-24 15-16 23 12 30 52 14 50 40-2 56-57 18-19 36 41 38 153 6 232 10 382 34Z" fill="#d9c49a" />
                <path d="M1440 447c-114-22-173-34-277-31s-213-26-212-51 80-36 77-49" stroke="#f4dfb4" strokeWidth="3" strokeLinecap="round" opacity=".7" />
                <g color="#46735d">
                  <use href="#hero-pine" x="116" y="230" width="45" height="103" />
                  <use href="#hero-pine" x="155" y="253" width="32" height="74" />
                  <use href="#hero-pine" x="1254" y="239" width="40" height="94" />
                  <use href="#hero-pine" x="1291" y="224" width="49" height="113" />
                </g>
                <g color="#234c3c">
                  <use href="#hero-pine" x="24" y="237" width="70" height="161" />
                  <use href="#hero-pine" x="77" y="292" width="47" height="108" />
                  <use href="#hero-pine" x="1314" y="260" width="60" height="139" />
                  <use href="#hero-pine" x="1364" y="211" width="80" height="184" />
                </g>
                <g transform="translate(993 277)">
                  <ellipse cx="8" cy="51" rx="21" ry="5" fill="#234c3c" opacity=".25" />
                  <path d="m5 27-5 13-10 7m20-20 6 12 4 11" stroke="#233f35" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m-12 48 7-1m21 4h7" stroke="#203e33" strokeWidth="5" strokeLinecap="round" />
                  <path d="m2 3 9 1 6 22-16 5-5-15Z" fill="#df8950" />
                  <rect x="-12" y="6" width="12" height="23" rx="5" transform="rotate(-12 -12 6)" fill="#e8b34e" />
                  <path d="M-7 10v13" stroke="#9b7537" strokeWidth="2" />
                  <path d="m12 11 8 11 9-3" stroke="#e6ad7d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m30 16-5 35" stroke="#243e34" strokeWidth="2" strokeLinecap="round" />
                  <path d="m3 4 1-9" stroke="#d99c6b" strokeWidth="6" />
                  <circle cx="5" cy="-8" r="8" fill="#e6ad7d" />
                  <path d="M-3-10q-2-13 10-10 6 2 7 10" fill="#294d3e" />
                  <path d="m-6-10 24 1" stroke="#294d3e" strokeWidth="4" strokeLinecap="round" />
                </g>
                <path d="M0 446c137-31 210-12 321 6s189-6 273-8 165 20 247 36H0Zm1197 34c95-39 159-42 243-27v27Z" fill="#244d3e" />
                <g stroke="#80956a" strokeWidth="2" strokeLinecap="round">
                  <path d="m292 433-4-16m4 16 8-13m-8 13-11-6m869-43 3-14m-3 14 10-8m-10 8-5-10m-754 67 3-13m-3 13-7-8" />
                </g>
                <g fill="#e0be76"><circle cx="288" cy="416" r="3" /><circle cx="300" cy="419" r="2" /><circle cx="1153" cy="368" r="2" /></g>
                <g stroke="#6c8980" strokeWidth="2" strokeLinecap="round"><path d="M270 97q7-5 13 0 7-5 13 0m22 16q5-4 9 0 5-4 9 0" /></g>
              </svg>
            </div>

            <div className="absolute top-[8%] sm:top-[12%] left-[2%] w-[58%] p-2 sm:p-2.5 -rotate-3 rounded-md bg-paper shadow-[0_5px_12px_rgba(24,63,53,0.14)] text-center" aria-label="Timer preview: 25 minutes of focus">
              <div className="flex items-center justify-between text-[9px] font-semibold text-ink">
                <span className="inline-flex items-center gap-1.5">
                  <i className="inline-block size-1 sm:size-1.5 rounded-full bg-[#608267]" aria-hidden="true" />
                  Time to focus
                </span>
                <span className="hidden sm:inline-block px-1 py-0.5 rounded bg-[#eaf0e4] text-[#53694f]">
                  Preview
                </span>
              </div>
              <span className="block mt-1 sm:mt-2 text-[clamp(22px,7vw,32px)] sm:text-[clamp(28px,3vw,42px)] font-medium leading-tight tracking-[-0.055em] tabular-nums text-ink">
                25:00
              </span>
              <div className="h-1 sm:h-1.5 mt-1.5 sm:mt-2.5 overflow-hidden rounded-full bg-[#e8ecdf]" aria-hidden="true">
                <span className="block h-full w-[22%] rounded-full bg-[#668366]" />
              </div>
              <div className="hidden sm:flex items-center justify-between mt-2 text-[#62715f] text-[9px]">
                <span>Trailhead</span>
                <span>Summit</span>
              </div>
            </div>
          </div>

          <figcaption className="grid gap-1 sm:gap-1.5 pt-2.5 sm:pt-3 px-0.5 sm:px-1 text-[#345545]">
            <span className="font-hand text-lg sm:text-[22px] leading-tight">One focused step at a time.</span>
            <small className="text-[10px] leading-normal">A 25-minute timer preview</small>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
