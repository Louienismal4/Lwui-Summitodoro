import { useState } from "react";
import { CurtainLink } from "@/components/layout/CurtainLink";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  EXPEDITION_MOUNTAINS,
  type ExpeditionMountain,
} from "@/data/expeditionMountains";
import { formatElevation } from "@/lib/expeditionPrep";
import { cn } from "@/lib/utils";

type Props = {
  selectedMountain: ExpeditionMountain;
  onSelectMountain: (mountain: ExpeditionMountain) => void;
  canSelectMountain: boolean;
};

export function TopPerimeterBar({
  selectedMountain,
  onSelectMountain,
  canSelectMountain,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 pointer-events-none flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3.5 bg-transparent"
      aria-label="Top perimeter bar"
    >
      {/* Brand logo (Left) */}
      <div className="pointer-events-auto flex items-center">
        <CurtainLink
          to="/"
          className="flex items-center gap-2 group transition-transform hover:scale-[1.05] active:scale-[2.0]"
          aria-label="Summitodoro home"
        >
          <img
            src="/summitodoro-logo.svg"
            alt="Summitodoro"
            className="h-12 sm:h-13 w-auto object-contain brightness-110 drop-shadow-sm"
          />
        </CurtainLink>
      </div>
      <DropdownMenu open={open && canSelectMountain} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          disabled={!canSelectMountain}
          title={
            canSelectMountain
              ? "Choose a mountain"
              : "Return to camp to change mountains"
          }
          className="pointer-events-auto border-0 bg-transparent py-2.5 text-sm font-semibold text-[var(--pine)]  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pine)] disabled:opacity-50 hover:scale-[1.05] transition-transform"
        >
          Mountain
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          aria-label="Choose a mountain"
          className="flex max-h-[min(420px,var(--available-height))] w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-2 text-[var(--ink)] shadow-[0_16px_48px_-12px_rgba(24,63,53,0.25)] ring-0"
        >
          <div
            className="flex shrink-0 items-center justify-between gap-3 px-3 pt-2 pb-3"
            aria-hidden="true"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--pine)]">
                Your next ascent
              </p>
              <p className="mt-1 font-heading text-xl text-[var(--ink-deep)]">
                Choose your peak
              </p>
            </div>
          </div>
          <DropdownMenuRadioGroup
            value={selectedMountain.id}
            className="grid min-h-0 max-h-64 gap-1.5 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
          >
            {EXPEDITION_MOUNTAINS.map((mountain) => {
              const isSelected = mountain.id === selectedMountain.id;
              return (
                <DropdownMenuRadioItem
                  key={mountain.id}
                  value={mountain.id}
                  label={mountain.name}
                  closeOnClick={false}
                  onClick={() => onSelectMountain(mountain)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 pr-8 text-left transition-colors duration-150 data-highlighted:bg-[var(--cream)] focus:bg-[var(--cream)] focus:text-[var(--ink)] focus:**:text-inherit motion-reduce:transition-none",
                    isSelected
                      ? "border-[var(--pine)]/30 bg-[var(--cream)] text-[var(--pine)]"
                      : "border-transparent bg-transparent hover:border-[var(--line)] hover:bg-[var(--cream)]",
                  )}
                >
                  <img
                    src={mountain.imagePath}
                    alt=""
                    className="size-16 shrink-0 rounded-lg object-cover shadow-sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-lg font-semibold leading-tight text-[var(--ink-deep)]">
                      {mountain.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--pine)]">
                      {mountain.province}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[var(--pine)]">
                      <span className="font-medium tabular-nums">
                        {formatElevation(mountain.elevationMasl)}
                      </span>
                      <span className="rounded-full bg-[var(--pine)]/10 px-2 py-0.5 font-medium capitalize">
                        {mountain.difficulty}
                      </span>
                    </span>
                  </span>
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
          <div className="mt-2 shrink-0 border-t border-[var(--line)] px-3 pt-3 pb-2">
            <p className="text-xs font-semibold text-[var(--pine)]">
              More peaks coming soon
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              New trails and fresh horizons are on the way.
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
