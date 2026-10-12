export interface CameraOffsetPadding {
  top: number
  bottom?: number
}



/**
 * Calculates camera vertical padding offset so that the Hiker Marker
 * is positioned inside the lower half (50%) of the viewport during active follow.
 *
 * @param viewportHeight Total height of the viewport in pixels
 * @param fraction Fraction of viewport to offset from top (defaults to 0.5)
 */
export function getCameraOffsetPadding(
  viewportHeight: number = typeof window !== 'undefined' ? window.innerHeight : 800,
  fraction = 0.5,
): CameraOffsetPadding {
  const safeHeight = Math.max(0, viewportHeight)
  return {
    top: Math.round(safeHeight * fraction),
  }
}

export interface MobileCameraOffsetOptions {
  viewportHeight?: number
  isSessionActive: boolean
  isSheetExpanded?: boolean
  isSheetVisible?: boolean
}

/**
 * Calculates responsive camera padding for mobile viewports (< 768px).
 *
 * When an active session is running with a docked bottom mini-tracker,
 * balanced padding avoids occlusion from top bar (56px) and docked tracker (80px).
 * When a bottom sheet is expanded, bottom padding ensures the Hiker Marker remains
 * cleanly framed in the visible map region above the sheet.
 */
export function getMobileCameraOffsetPadding({
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800,
  isSessionActive,
  isSheetExpanded = false,
  isSheetVisible = true,
}: MobileCameraOffsetOptions): CameraOffsetPadding {
  const safeHeight = Math.max(0, viewportHeight)
  const topPadding = 56 // Top perimeter bar clearance

  if (isSessionActive) {
    if (isSheetExpanded) {
      // Expanded sheet takes ~55% of the screen from the bottom
      return {
        top: topPadding,
        bottom: safeHeight > 0 ? Math.round(safeHeight * 0.55) : 80,
      }
    }
    // Docked mini-tracker at the bottom
    return {
      top: topPadding,
      bottom: 80,
    }
  }

  // At Camp state
  if (!isSheetVisible) {
    return { top: topPadding }
  }

  if (isSheetExpanded) {
    return {
      top: topPadding,
      bottom: safeHeight > 0 ? Math.round(safeHeight * 0.5) : 96,
    }
  }

  // At Camp with peeked sheet
  return {
    top: topPadding,
    bottom: 96,
  }
}
