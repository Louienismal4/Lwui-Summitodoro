import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "@/components/icons";

type Props = {
  activeView: "home" | "about" | "changelog" | "hike";
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  onNavigateChangelog: () => void;
  onStartExpedition: () => void;
};

export function SiteHeader({
  activeView,
  onNavigateHome,
  onNavigateAbout,
  onNavigateChangelog,
  onStartExpedition,
}: Props) {
  return (
    <header className="info-header flex items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-[var(--line)]">
      {/* Brand logo */}
      <a
        className="info-brand cursor-pointer shrink-0 block overflow-hidden"
        aria-label="Summitodoro home"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onNavigateHome();
        }}
      >
        <img
          alt="Summitodoro"
          width={1000}
          height={200}
          className="info-brand-logo w-full h-auto object-contain block"
          src="/summitodoro-logo.svg"
        />
      </a>

      {/* Desktop Navigation (visible on tablet and desktop: 768px+) */}
      <nav
        aria-label="Desktop navigation"
        className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartExpedition}
          className={`h-8 px-2.5 sm:px-3 text-xs sm:text-sm font-bold rounded-md cursor-pointer transition-colors ${
            activeView === "hike"
              ? "text-[var(--pine)] bg-[#183f350c] hover:bg-[#183f350c] font-extrabold"
              : "text-[#617067] hover:text-[var(--pine)] hover:bg-transparent hover:underline"
          }`}
        >
          Expedition
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateAbout}
          className={`h-8 px-2.5 sm:px-3 text-xs sm:text-sm font-bold rounded-md transition-colors cursor-pointer ${
            activeView === "about"
              ? "text-[var(--pine)] bg-transparent hover:bg-transparent font-extrabold"
              : "text-[#617067] hover:text-[var(--pine)] hover:bg-transparent hover:underline"
          }`}
        >
          About
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateChangelog}
          className={`h-8 px-2.5 sm:px-3 text-xs sm:text-sm font-bold rounded-md transition-colors cursor-pointer ${
            activeView === "changelog"
              ? "text-[var(--pine)] bg-transparent hover:bg-transparent font-extrabold"
              : "text-[#617067] hover:text-[var(--pine)] hover:bg-transparent hover:underline"
          }`}
        >
          Changelog
        </Button>
      </nav>

      {/* Mobile Navigation: Hamburger Menu + Dropdown (visible on mobile: < 768px) */}
      <div className="flex md:hidden items-center shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="size-10 rounded-lg text-[var(--ink)] flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--pine)] transition-colors shadow-xs"
            aria-label="Open mobile navigation menu"
          >
            <MenuIcon className="size-7" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={8}
            className="w-52 min-w-[13rem] rounded-xl bg-[var(--paper)] border border-[var(--line)] p-1.5 shadow-xl text-[var(--ink)] z-50 animate-in fade-in-0 zoom-in-95"
          >
            <DropdownMenuItem
              onClick={onStartExpedition}
              className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
                activeView === "hike"
                  ? "text-[var(--pine)] bg-[#183f3510] font-extrabold"
                  : "text-[var(--ink)] hover:bg-[var(--cream)] focus:bg-[var(--cream)]"
              }`}
            >
              <span>Expedition</span>
              <span className="text-[10px] bg-[var(--coral)]/10 text-[var(--coral)] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                Hike →
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[var(--line)] my-1" />

            <DropdownMenuItem
              onClick={onNavigateAbout}
              className={`flex items-center py-2.5 px-3 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
                activeView === "about"
                  ? "text-[var(--pine)] bg-[#183f3510] font-extrabold"
                  : "text-[#617067] hover:bg-[var(--cream)] focus:bg-[var(--cream)] hover:text-[var(--ink)]"
              }`}
            >
              About
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onNavigateChangelog}
              className={`flex items-center py-2.5 px-3 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
                activeView === "changelog"
                  ? "text-[var(--pine)] bg-[#183f3510] font-extrabold"
                  : "text-[#617067] hover:bg-[var(--cream)] focus:bg-[var(--cream)] hover:text-[var(--ink)]"
              }`}
            >
              Changelog
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
