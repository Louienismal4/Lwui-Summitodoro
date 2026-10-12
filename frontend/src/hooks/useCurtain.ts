import { createContext, useContext, useCallback } from 'react'
import { useNavigate, type NavigateOptions, type To } from 'react-router-dom'
import type { CurtainPhase } from '@/lib/curtainTransition'

export interface CurtainContextValue {
  phase: CurtainPhase
  isTransitioning: boolean
  triggerTransition: (
    onCovered: () => void | Promise<void>,
  ) => Promise<void>
}

export const CurtainContext = createContext<CurtainContextValue | null>(null)

export function useCurtain(): CurtainContextValue {
  const context = useContext(CurtainContext)
  if (!context) {
    throw new Error('useCurtain must be used within a <CurtainProvider>')
  }
  return context
}

export type CurtainNavigateFunction = (
  to: To,
  options?: NavigateOptions,
) => Promise<void>

/**
 * Hook providing a navigate function wrapped with the smooth iris curtain wipe
 */
export function useCurtainNavigate(): CurtainNavigateFunction {
  const navigate = useNavigate()
  const context = useContext(CurtainContext)

  return useCallback(
    async (to: To, options?: NavigateOptions) => {
      if (!context) {
        navigate(to, options)
        return
      }

      await context.triggerTransition(() => {
        navigate(to, options)
      })
    },
    [context, navigate],
  )
}
