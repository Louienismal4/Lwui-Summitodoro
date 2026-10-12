import { Separator } from '@/components/ui/separator'

export function SiteFooter() {
  return (
    <footer className="info-footer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 sm:pt-6 mt-10 sm:mt-14 border-t border-[var(--line)] text-xs text-[#748078]">
      <p className="m-0">© 2026 Summitodoro. Focus is an expedition.</p>
      <nav aria-label="Legal and support" className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
        <a
          href="#privacy"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[var(--pine)] transition-colors underline-offset-4 hover:underline"
        >
          Privacy
        </a>
        <Separator orientation="vertical" className="h-3 bg-[var(--line)]" />
        <a
          href="#terms"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[var(--pine)] transition-colors underline-offset-4 hover:underline"
        >
          Terms
        </a>
        <Separator orientation="vertical" className="h-3 bg-[var(--line)]" />
        <a
          href="mailto:louienismalz@gmail.com"
          className="hover:text-[var(--pine)] transition-colors underline-offset-4 hover:underline"
        >
          Contact
        </a>
      </nav>
    </footer>
  )
}
