export type Point = {
  x: number;
  y: number;
};

export type CurtainPhase = "idle" | "covering" | "covered" | "revealing";

export type CurtainClipStage =
  | "cover-start"
  | "cover-end"
  | "reveal-start"
  | "reveal-end";

export interface CurtainConfig {
  coverDurationSec: number;
  revealDurationSec: number;
  pauseDurationMs: number;
  easing: [number, number, number, number];
}

export const DEFAULT_CURTAIN_CONFIG: CurtainConfig = {
  coverDurationSec: 0.5,
  revealDurationSec: 0.5,
  pauseDurationMs: 150,
  easing: [0.65, 0, 0.35, 1],
};

/**
 * Returns center coordinates for viewport or point if provided
 */
export function getCurtainCenter(
  viewportWidth: number,
  viewportHeight: number,
): Point {
  return {
    x: Math.round(viewportWidth / 2),
    y: Math.round(viewportHeight / 2),
  };
}

/**
 * Calculates circle radius required to cover the farthest corner from the screen center
 */
export function calculateCurtainCenterRadius(
  viewportWidth: number,
  viewportHeight: number,
): number {
  const dx = viewportWidth / 2;
  const dy = viewportHeight / 2;
  // Buffer to ensure complete corner coverage across high-DPI screens
  return Math.ceil(Math.hypot(dx, dy)) + 30;
}

/**
 * Backward compatible radius calculator
 */
export function calculateCurtainMaxRadius(
  origin: Point,
  viewportWidth: number,
  viewportHeight: number,
): number {
  const dx = Math.max(origin.x, viewportWidth - origin.x);
  const dy = Math.max(origin.y, viewportHeight - origin.y);
  return Math.ceil(Math.hypot(dx, dy)) + 30;
}

/**
 * Generates centered CSS clip-path circle strings for smooth cover and reveal stages
 */
export function createCurtainClipPath(
  stage: CurtainClipStage,
  origin: Point | null = null,
  radius = 0,
): string {
  const position = origin ? `${origin.x}px ${origin.y}px` : "50% 50%";

  switch (stage) {
    case "cover-start":
      return `circle(0px at ${position})`;
    case "cover-end":
      return `circle(${radius}px at ${position})`;
    case "reveal-start":
      return `circle(${radius}px at 50% 50%)`;
    case "reveal-end":
      return `circle(0px at 50% 50%)`;
  }
}
