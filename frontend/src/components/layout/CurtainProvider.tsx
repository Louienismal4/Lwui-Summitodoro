import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import {
  DEFAULT_CURTAIN_CONFIG,
  calculateCurtainCenterRadius,
  createCurtainClipPath,
  type CurtainConfig,
  type CurtainPhase,
} from "@/lib/curtainTransition";
import { CurtainContext, type CurtainContextValue } from "@/hooks/useCurtain";

type Props = {
  children: ReactNode;
  config?: Partial<CurtainConfig>;
};

export function CurtainProvider({ children, config: customConfig }: Props) {
  const [phase, setPhase] = useState<CurtainPhase>("idle");
  const [scope, animate] = useAnimate();
  const curtainRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const config: CurtainConfig = useMemo(
    () => ({
      ...DEFAULT_CURTAIN_CONFIG,
      ...customConfig,
    }),
    [customConfig],
  );

  useEffect(() => {
    return () => {
      isRunningRef.current = false;
    };
  }, []);

  const triggerTransition = useCallback(
    async (onCovered: () => void | Promise<void>) => {
      if (isRunningRef.current) {
        return;
      }

      isRunningRef.current = true;

      try {
        const width = typeof window !== "undefined" ? window.innerWidth : 1024;
        const height = typeof window !== "undefined" ? window.innerHeight : 768;
        const radius = calculateCurtainCenterRadius(width, height);

        if (shouldReduceMotion) {
          // Graceful degradation: quick gentle cross-fade
          setPhase("covering");
          if (curtainRef.current) {
            curtainRef.current.style.visibility = "visible";
            curtainRef.current.style.clipPath = "none";
            await animate(
              curtainRef.current,
              { opacity: [0, 1] },
              { duration: 0.15 },
            );
          }

          setPhase("covered");
          await onCovered();
          await new Promise((resolve) =>
            setTimeout(resolve, config.pauseDurationMs),
          );

          setPhase("revealing");
          if (curtainRef.current) {
            await animate(
              curtainRef.current,
              { opacity: [1, 0] },
              { duration: 0.15 },
            );
            curtainRef.current.style.visibility = "hidden";
          }
          setPhase("idle");
          return;
        }

        // 1. Cover Phase: Circle starts in the middle, expanding to cover the screen
        setPhase("covering");
        if (curtainRef.current) {
          curtainRef.current.style.visibility = "visible";
          curtainRef.current.style.opacity = "1";

          const startClip = createCurtainClipPath("cover-start");
          const endClip = createCurtainClipPath("cover-end", null, radius);

          curtainRef.current.style.clipPath = startClip;

          await animate(
            curtainRef.current,
            { clipPath: [startClip, endClip] },
            { duration: config.coverDurationSec, ease: config.easing },
          );
        }

        // 2. Covered Phase: Route changes seamlessly behind the solid curtain
        setPhase("covered");
        await onCovered();

        // Brief frame pause for React to render the destination page behind the veil
        if (config.pauseDurationMs > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, config.pauseDurationMs),
          );
        }

        // 3. Reveal Phase: Covered circle smoothly shrinks from edges back into the middle
        setPhase("revealing");
        if (curtainRef.current) {
          const revealStartClip = createCurtainClipPath(
            "reveal-start",
            null,
            radius,
          );
          const revealEndClip = createCurtainClipPath("reveal-end", null, 0);

          await animate(
            curtainRef.current,
            { clipPath: [revealStartClip, revealEndClip] },
            { duration: config.revealDurationSec, ease: config.easing },
          );

          curtainRef.current.style.visibility = "hidden";
        }

        setPhase("idle");
      } catch (err) {
        console.error("Curtain transition error:", err);
        if (curtainRef.current) {
          curtainRef.current.style.visibility = "hidden";
        }
        setPhase("idle");
      } finally {
        isRunningRef.current = false;
      }
    },
    [animate, config, shouldReduceMotion],
  );

  const isTransitioning = phase !== "idle";

  const contextValue: CurtainContextValue = useMemo(
    () => ({
      phase,
      isTransitioning,
      triggerTransition,
    }),
    [phase, isTransitioning, triggerTransition],
  );

  return (
    <CurtainContext.Provider value={contextValue}>
      <div ref={scope} className="relative w-full h-full">
        {children}

        {/* Minimalist Solid Iris Curtain Overlay */}
        <div
          ref={curtainRef}
          role="presentation"
          aria-hidden="true"
          className={`fixed inset-0 z-100 bg-[#0d2d26] select-none transition-none ${
            isTransitioning ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            visibility: isTransitioning ? "visible" : "hidden",
            clipPath: "circle(0px at 50% 50%)",
            willChange: "clip-path, opacity",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        />
      </div>
    </CurtainContext.Provider>
  );
}
