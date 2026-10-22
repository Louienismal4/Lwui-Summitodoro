import {
  Timer,
  Mountain,
  Award,
  Check,
  Flame,
  Flag,
  Pause,
} from "lucide-react";
import { ExpeditionHero } from "@/components/layout/ExpeditionHero";
import { WalkingHiker } from "@/components/layout/MountainScene";
import { BentoCard } from "@/components/layout/BentoCard";
import { CurtainLink } from "@/components/layout/CurtainLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { EXPEDITION_MOUNTAINS } from "@/data/expeditionMountains";
import "@/styles/landing.css";

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
    <main className="focus-landing">
      <div className="landing-paper">
        <SiteHeader
          activeView="home"
          onNavigateHome={() => {}}
          onNavigateAbout={onNavigateAbout}
          onNavigateChangelog={onNavigateChangelog}
          onStartExpedition={onStartExpedition}
        />
        <ExpeditionHero />
        <section
          className="focus-benefits landing-section"
          id="how-it-works"
          tabIndex={-1}
          aria-labelledby="benefits-heading"
        >
          <div className="benefits-trail">
            <div className="benefits-trail-landscape" aria-hidden="true" />
            <WalkingHiker direction="east" walking className="benefits-hiker" />
          </div>
          <h2 id="benefits-heading">
            Focus does <span>more</span> for you.
          </h2>
          <p className="section-description">
            A familiar Pomodoro rhythm. A much better view.
          </p>
          <div className="bento-grid">
            <BentoCard
              className="bento-timer"
              label="Find your flow"
              icon={<Timer size={16} />}
              title={
                <>
                  The climb that keeps
                  <br />
                  you <span>on track.</span>
                </>
              }
              copy="Pick a task, set your pace, and let your hiker do the climbing."
            >
              <div className="snippet-timer">
                <span>
                  <i /> Deep work <small>25 min</small>
                </span>
                <strong>24:35</strong>
                <div className="snippet-track">
                  <i />
                </div>
                <p>
                  <Check size={12} /> One task. One trail.
                </p>
                <span className="snippet-play">
                  <Pause size={12} fill="currentColor" />
                </span>
              </div>
              <div className="snippet-task">
                <span>
                  <Check size={14} />
                </span>{" "}
                A little closer to done <span>✦</span>
              </div>
            </BentoCard>
            <BentoCard
              className="bento-log"
              label="Make it a habit"
              icon={<Flame size={16} />}
              title={
                <>
                  Streaks that
                  <br />
                  <span>don’t melt.</span>
                </>
              }
              copy="Keep your focus going. Every summit has a place in your logbook."
            >
              <div className="snippet-log">
                <span>
                  <Flame size={19} /> A good week <small>Example</small>
                </span>
                <div className="week-dots">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i}>
                      <small>{day}</small>
                      <span className={i < 5 ? "day-done" : ""}>
                        {i < 5 ? <Check size={13} /> : "·"}
                      </span>
                    </div>
                  ))}
                </div>
                <p>
                  <Flag size={14} />
                  <strong>Mt. Pinatubo</strong>
                  <span>Summited ✓</span>
                </p>
              </div>
            </BentoCard>
            <BentoCard
              className="bento-rewards"
              label="Earn your altitude"
              icon={<Award size={16} />}
              title={
                <>
                  Badges worth
                  <br />
                  <span>bragging about.</span>
                </>
              }
              copy="Earn experience, collect Trail Coins, and unlock your next mountain."
            >
              <div className="snippet-badges">
                <div className="reward-badge badge-side">
                  <Flag />
                </div>
                <div className="reward-badge badge-main">
                  <Mountain />
                  <span>SUMMIT CLUB</span>
                  <small>one focused step</small>
                </div>
                <div className="reward-badge badge-side">
                  <Award />
                </div>
              </div>
              <p className="reward-caption">Little wins. Higher peaks.</p>
            </BentoCard>
          </div>
        </section>
        <section
          className="landing-trails landing-section"
          id="trails"
          aria-labelledby="trails-heading"
        >
          <div className="trails-heading">
            <div>
              <h2 id="trails-heading">
                Your next <span>high point.</span>
              </h2>
              <p className="section-description">
                Real Philippine mountains. Your own kind of adventure.
              </p>
            </div>
            <CurtainLink to="/hike" className="trail-link">
              Find your trail <span aria-hidden="true">↗</span>
            </CurtainLink>
          </div>
          <div className="landing-trail-grid">
            {EXPEDITION_MOUNTAINS.map((mountain) => (
              <article className="landing-trail" key={mountain.id}>
                <img
                  src={`/images/mountains/${mountain.slug.replace("mt-", "")}-illustrated.svg`}
                  alt={`Illustration of ${mountain.name}`}
                  width="320"
                  height="270"
                  loading="lazy"
                />
                <div>
                  <h3>{mountain.name}</h3>
                  <span>
                    {mountain.elevationMasl.toLocaleString("en-US")} m
                  </span>
                </div>
                <p>
                  {mountain.province}
                  <span>
                    {mountain.isDefaultUnlocked
                      ? "Your first trail"
                      : `Level ${mountain.requiredLevel}`}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="landing-signoff landing-section"
          aria-labelledby="signoff-heading"
        >
          <h2 id="signoff-heading">
            A little focus.
            <br />A <span>whole new view.</span>
          </h2>
          <CurtainLink to="/hike" className="focus-cta">
            Start climbing, free <span aria-hidden="true">↗</span>
          </CurtainLink>
          <p>No account needed. Just a little time for what matters.</p>
        </section>
        <footer className="landing-footer">
          <CurtainLink to="/" aria-label="Summitodoro home">
            <img
              src="/summitodoro-logo.svg"
              alt="Summitodoro"
              width="150"
              height="30"
            />
          </CurtainLink>

          <small>© {new Date().getFullYear()} Summitodoro</small>
        </footer>
      </div>
    </main>
  );
}
