import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

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
  const isHome = activeView === "home";

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 mx-auto",
        isHome
          ? "max-w-[1200px] w-[calc(100%-40px)] sm:w-[calc(100%-80px)] min-h-[76px] sm:min-h-[96px] py-4 sm:py-[22px] border-b-0"
          : "max-w-[1080px] w-full pb-4 sm:pb-[22px] border-b border-line",
      )}
    >
      {/* Brand logo */}
      <a
        className={cn(
          "cursor-pointer shrink-0 block overflow-hidden aspect-[5] text-ink-deep",
          isHome ? "w-[156px]" : "w-[clamp(120px,25vw,190px)]",
        )}
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
          className="w-full h-auto object-contain block"
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
          className={cn(
            "h-8 px-2.5 sm:px-3 text-xs sm:text-sm font-bold rounded-md cursor-pointer transition-colors",
            activeView === "hike"
              ? "text-pine bg-[#183f350c] hover:bg-[#183f350c] font-extrabold"
              : "text-[#617067] hover:text-pine hover:bg-transparent hover:underline",
          )}
        >
          Expedition
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateAbout}
          className={cn(
            "h-8 px-2.5 sm:px-3 text-xs sm:text-sm font-bold rounded-md transition-colors cursor-pointer",
            activeView === "about"
              ? "text-pine bg-transparent hover:bg-transparent font-extrabold"
              : "text-[#617067] hover:text-pine hover:bg-transparent hover:underline",
          )}
        >
          About
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateChangelog}
          className={cn(
            "h-8 px-2.5 sm:px-3 text-xs sm:text-sm font-bold rounded-md transition-colors cursor-pointer",
            activeView === "changelog"
              ? "text-pine bg-transparent hover:bg-transparent font-extrabold"
              : "text-[#617067] hover:text-pine hover:bg-transparent hover:underline",
          )}
        >
          Changelog
        </Button>
      </nav>

      {/* Mobile Navigation: Hamburger Menu + Dropdown (visible on mobile: < 768px) */}
      <div className="flex md:hidden items-center shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="size-10 rounded-lg text-ink flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pine transition-colors shadow-xs"
            aria-label="Open mobile navigation menu"
          >
            <MenuIcon className="size-7" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={8}
            className="w-52 min-w-[13rem] rounded-xl bg-paper border border-line p-1.5 shadow-xl text-ink z-50 animate-in fade-in-0 zoom-in-95"
          >
            <DropdownMenuItem
              onClick={onStartExpedition}
              className={cn(
                "flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-bold cursor-pointer transition-colors",
                activeView === "hike"
                  ? "text-pine bg-[#183f3510] font-extrabold"
                  : "text-ink hover:bg-cream focus:bg-cream",
              )}
            >
              <span>Expedition</span>
              <span className="text-[10px] bg-coral/10 text-coral px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                Hike →
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-line my-1" />

            <DropdownMenuItem
              onClick={onNavigateAbout}
              className={cn(
                "flex items-center py-2.5 px-3 rounded-lg text-sm font-bold cursor-pointer transition-colors",
                activeView === "about"
                  ? "text-pine bg-[#183f3510] font-extrabold"
                  : "text-[#617067] hover:bg-cream focus:bg-cream hover:text-ink",
              )}
            >
              About
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onNavigateChangelog}
              className={cn(
                "flex items-center py-2.5 px-3 rounded-lg text-sm font-bold cursor-pointer transition-colors",
                activeView === "changelog"
                  ? "text-pine bg-[#183f3510] font-extrabold"
                  : "text-[#617067] hover:bg-cream focus:bg-cream hover:text-ink",
              )}
            >
              Changelog
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
