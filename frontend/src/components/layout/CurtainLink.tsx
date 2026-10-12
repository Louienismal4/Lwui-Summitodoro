import type { MouseEvent, ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { useCurtainNavigate } from '@/hooks/useCurtain'

type Props = ComponentProps<typeof Link>

export function CurtainLink({ to, onClick, children, ...props }: Props) {
  const curtainNavigate = useCurtainNavigate()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault()
      curtainNavigate(to)
    }
  }

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
