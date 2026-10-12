import { useSyncExternalStore } from 'react'

/**
 * Hook to detect whether the viewport is below a specific mobile breakpoint.
 *
 * @param breakpoint Max viewport width for mobile (defaults to 768px matching Tailwind md)
 */
export function useIsMobile(breakpoint = 768): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {}
      const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    () => (typeof window !== 'undefined' ? window.innerWidth < breakpoint : false),
    () => false,
  )
}
