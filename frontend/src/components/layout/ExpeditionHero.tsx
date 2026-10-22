import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurtainLink } from "@/components/layout/CurtainLink";
import { StickerLayer } from "@/components/layout/StickerLayer";
import { useFocusSession } from "@/hooks/useFocusSession";
import { formatRemainingTime } from "@/lib/formatTime";

export function ExpeditionHero() {
  const session = useFocusSession(25);
  const running = session.status === "running";
  const completed = session.status === "completed";

  function toggleTimer() {
    if (running) session.pause();
    else if (session.status === "paused") session.resume();
    else {
      if (completed) session.reset();
      session.setDurationMinutes(25);
      session.start();
    }
  }

  return (
    <section className="focus-hero" aria-labelledby="expedition-hero-heading">
      <div className="focus-hero-copy">
        <p className="hero-intro"> A little focus. A higher point of view.</p>
        <h1 id="expedition-hero-heading">
          The <span>climb</span> that finally <br className="hidden sm:block" />{" "}
          keeps you focused.
        </h1>

        <p className="hero-description">
          Turn your to-do into a trail. One focused session,
          <br className="hidden sm:block" /> one small step closer to the
          summit.
        </p>
        <CurtainLink to="/hike" className="focus-cta">
          Start climbing, free <span aria-hidden="true">↗</span>
        </CurtainLink>
        <p className="hero-no-account">No account needed</p>
      </div>
      <div className="hero-landscape">
        <div className="landscape-orbit" aria-hidden="true" />
        <StickerLayer />
        <div className="hero-mountain">
          <div className="mountain-scene">
            <img
              src="/images/mountains/focus-voxel.svg"
              alt="Snowy, pine-covered mountain"
              width="640"
              height="480"
              fetchPriority="high"
            />
          </div>
        </div>
        <div
          className="summit-timer"
          aria-label="Interactive focus timer preview"
        >
          <span className="timer-status">
            <i />{" "}
            {completed
              ? "Summit reached"
              : running
                ? "Time to focus"
                : session.status === "paused"
                  ? "Taking a breath"
                  : "Your first ascent"}
            <small>Preview</small>
          </span>
          <div className="timer-face">
            <span
              className="timer-digits"
              aria-label={`Time remaining: ${formatRemainingTime(session.remainingMs)}`}
            >
              {formatRemainingTime(session.remainingMs).slice(3)}
            </span>
            <Button
              size="icon"
              className="timer-toggle"
              onClick={toggleTimer}
              aria-label={
                running
                  ? "Pause preview timer"
                  : completed
                    ? "Restart preview timer"
                    : "Start or resume preview timer"
              }
            >
              {running ? (
                <Pause size={15} />
              ) : (
                <Play size={15} fill="currentColor" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="timer-reset"
              aria-label="Reset preview timer"
              onClick={() => {
                session.reset();
                session.setDurationMinutes(25);
              }}
            >
              <RotateCcw size={14} />
            </Button>
          </div>
          <div
            className="preview-progress"
            role="progressbar"
            aria-label="Preview climb progress"
            aria-valuenow={Math.round(session.progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${session.progress * 100}%` }} />
          </div>
        </div>
        <div className="mountain-note" aria-hidden="true">
          Small steps.
          <br />
          Real progress.
          <svg viewBox="0 0 80 50" fill="none">
            <path
              d="M72 5C67 35 42 42 9 27m0 0 8 17M9 27l19-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="landscape-caption">
          <span aria-hidden="true">✦</span> Less scrolling. More summiting.
        </p>
      </div>
    </section>
  );
}
