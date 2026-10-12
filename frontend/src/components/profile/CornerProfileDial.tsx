import type { HikerProfile } from "@/hooks/useHikerProfile";
import {
  formatProfileDialBadge,
  formatProfileDialAriaLabel,
  formatProfileDialTooltip,
  calculateVisibleArcDash,
  calculateVisibleArcPath,
  isImageAvatar,
  getAvatarEmoji,
} from "@/lib/profileDial";
import { cn } from "@/lib/utils";

type Props = {
  profile: HikerProfile;
  onOpenProfile: () => void;
  className?: string;
};

export function CornerProfileDial({
  profile,
  onOpenProfile,
  className,
}: Props) {
  const badgeText = formatProfileDialBadge(profile);
  const ariaLabel = formatProfileDialAriaLabel(profile);
  const tooltipData = formatProfileDialTooltip(profile);
  const arcDash = calculateVisibleArcDash(44, tooltipData.progressPercent);
  const arcPath = calculateVisibleArcPath(44, 48);
  const hasImage = isImageAvatar(profile.avatarUrl);
  const avatarEmoji = getAvatarEmoji(profile.avatarUrl);

  const rankBadgeVariantClass = tooltipData.isGuest
    ? "bg-[#1e2a21] text-[#869489] border-[#2c3d30]"
    : "bg-[#0aa256]/20 text-[#2ecc71] border-[#0aa256]/30";

  return (
    <div
      className={cn(
        "fixed -bottom-8 -left-6 md:-bottom-10 md:-left-7 z-30 pointer-events-none select-none group",
        className,
      )}
    >
      {/* Interactive Exp Inspection Tooltip (Issue 03) */}
      <div
        role="tooltip"
        id="corner-profile-tooltip"
        className={cn(
          "absolute bottom-36 left-28 z-40 pointer-events-none transition-all duration-200",
          "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
          "translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0",
        )}
      >
        <div className="rounded-xl bg-[#111712]/95 border border-[#2c3d30] shadow-2xl p-2.5 text-xs text-[#f5f0e4] backdrop-blur-md min-w-[180px] flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3 border-b border-[#202e24] pb-1.5">
            <span className="font-bold text-white tracking-wide truncate max-w-[110px]">
              {tooltipData.displayName}
            </span>
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                rankBadgeVariantClass,
              )}
            >
              {tooltipData.rankText}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#a5c4af] pt-0.5">
            <span>Exp Progress</span>
            <span className="font-semibold text-[#e2ede4]">
              {tooltipData.expText}
            </span>
          </div>
        </div>
      </div>

      {/* Main Circular Dial Button */}
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label={ariaLabel}
        aria-describedby="corner-profile-tooltip"
        className={cn(
          "pointer-events-auto relative size-32 md:size-48 rounded-full flex items-center justify-center",
          "bg-[#141d16]/95 border-2 border-[#2b3d30] shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md",
          "cursor-pointer outline-none transition-all duration-200 ease-out",
          "hover:scale-[1.03] hover:border-[#3a5241] hover:shadow-[0_12px_28px_rgba(0,0,0,0.6),0_0_16px_rgba(10,162,86,0.25)]",
          "active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-[#0aa256] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1712] focus-visible:scale-[1.03]",
        )}
      >
        {/* SVG 75% Arc Progress Ring (Issue 02) */}
        <svg
          className="absolute inset-0 size-full pointer-events-none overflow-visible"
          viewBox="0 0 96 96"
          aria-hidden="true"
        >
          {/* Background Track Arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#1f2e24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#0aa256"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={arcDash.strokeDasharray}
            strokeDashoffset={arcDash.strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-700 ease-out drop-shadow-[0_0_4px_rgba(10,162,86,0.5)]"
          />
        </svg>

        {/* Inner avatar circular container */}
        <div className="size-28 md:size-42 rounded-full bg-[#1b251e] border border-[#304135]/80 flex items-center justify-center overflow-hidden shadow-inner z-10">
          {hasImage ? (
            <img
              src={profile.avatarUrl!}
              alt=""
              className="size-full object-cover rounded-full"
            />
          ) : (
            <span className="text-3xl select-none" aria-hidden="true">
              {avatarEmoji}
            </span>
          )}
        </div>

        {/* Attached status badge on top-right rim */}
        <div className="absolute top-1.5 right-1.5 z-20 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#17241b] text-[#7eb38c] border border-[#2f4635] shadow-md flex items-center gap-1">
            {badgeText}
          </span>
        </div>
      </button>
    </div>
  );
}
