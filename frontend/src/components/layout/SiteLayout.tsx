import type { ReactNode } from 'react'
import { buttonVariants } from '../ui/button'

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="/">
          <img src="/summitodoro-logo.svg" width="250" height="50" alt="Summitodoro home" />
        </a>
        <nav aria-label="Main navigation">
          <a className={buttonVariants({ variant: 'ghost' })} href="/" aria-current="page">
            Home
          </a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="site-footer">
        <p>Summitodoro · One focused step at a time.</p>
        <a href="/">Home</a>
      </footer>
    </div>
  )
}
