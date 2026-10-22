import type { ReactNode } from 'react'

export function BentoCard({ label, icon, title, copy, className, children }: { label: string; icon: ReactNode; title: ReactNode; copy: string; className: string; children: ReactNode }) {
  return (
    <article className={`focus-bento ${className}`}>
      <p className="bento-label">{icon}{label}</p>
      <div className="bento-illustration" aria-hidden="true">{children}</div>
      <h3>{title}</h3>
      <p className="bento-copy">{copy}</p>
    </article>
  )
}
