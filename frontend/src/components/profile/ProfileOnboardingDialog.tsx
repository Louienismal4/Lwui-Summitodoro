import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  initialName?: string;
  mode?: "onboarding" | "edit";
  onContinueAsGuest: (name: string) => void;
  onLogin: (email: string, pass: string) => Promise<unknown>;
  onRegister?: (name: string, email: string, pass: string) => Promise<unknown>;
  onClose?: () => void;
};

const SLIDES = [1, 2, 3, 4];

export function ProfileOnboardingDialog({
  open,
  onOpenChange,
  initialName = "",
  mode = "onboarding",
  onContinueAsGuest,
  onLogin,
  onRegister,
  onClose,
}: Props) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const name = String(data.get("name") || "").trim();

    if (!email || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      if (isRegistering && onRegister) {
        await onRegister(name, email, password);
      } else {
        await onLogin(email, password);
      }
      onClose?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setErrorMessage(
        msg ||
          (isRegistering
            ? "Unable to register. Please check your details."
            : "Unable to sign in. Please verify your credentials."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen || mode !== "onboarding") {
      onOpenChange?.(nextOpen);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      disablePointerDismissal={mode === "onboarding"}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[340px] sm:max-w-sm md:max-w-[860px] w-full bg-[var(--paper)] p-0! gap-0! rounded-xl md:rounded-3xl shadow-2xl overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-2 items-stretch max-h-[92dvh] md:h-[540px]"
      >
        {/* Left Section: Full container carousel */}
        <div
          className="hidden md:block relative w-full h-full overflow-hidden bg-[#14231b] select-none"
          aria-roledescription="carousel"
          aria-label="Summitodoro preview gallery"
        >
          {SLIDES.map((slideNum, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slideNum}
                aria-hidden={!isActive}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={`/images/carousel/slide-${slideNum}.svg`}
                  alt={`Summitodoro Expedition Slide ${slideNum}`}
                  className="w-full h-full object-contain block select-none pointer-events-none"
                />
              </div>
            );
          })}

          {/* Subtle bottom gradient for indicator contrast */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-15 pointer-events-none" />

          {/* Pagination indicators */}
          <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={currentSlide === i ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-xs ${
                  currentSlide === i
                    ? "w-7 bg-[#fffdf7]"
                    : "w-1.5 bg-[#ffffff50] hover:bg-[#ffffff90]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Sign In Form */}
        <div className="p-6 sm:p-7 md:p-8 flex flex-col justify-center bg-[var(--paper)] h-full overflow-y-hidden scroll">
          <img
            src="/summitodoro-logo.svg"
            alt="Summitodoro"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain block mb-3 sm:mb-3.5"
          />
          <DialogHeader className="gap-0.5 sm:gap-1 text-left mb-1">
            <DialogTitle className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[var(--ink-deep)] leading-tight">
              {isRegistering
                ? "Create Hiker Account"
                : mode === "edit"
                  ? "Hiker Sign In"
                  : "Welcome to Summitodoro"}
            </DialogTitle>
            <DialogDescription className="text-[11px] sm:text-xs md:text-sm text-[#637168] leading-normal sm:leading-relaxed">
              {isRegistering
                ? "Join Summitodoro to sync your mountain climbs and gear loadout."
                : "Sign in to record your summits, focus sessions, and trail milestones."}
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <p
              role="alert"
              className="text-[11px] sm:text-xs text-[var(--coral)] font-semibold leading-snug mt-1"
            >
              {errorMessage}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            onChange={() => errorMessage && setErrorMessage(null)}
            className="space-y-2.5 sm:space-y-3 mt-2 sm:mt-2.5"
          >
            {isRegistering && (
              <div className="space-y-1">
                <Label
                  htmlFor="reg-name"
                  className="text-[11px] sm:text-xs font-bold text-[var(--ink)]"
                >
                  Hiker Name
                </Label>
                <Input
                  id="reg-name"
                  name="name"
                  type="text"
                  placeholder="Hiker Name"
                  defaultValue={initialName}
                  disabled={isLoading}
                  className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2.5 sm:px-3 bg-[var(--cream)]/60 border-[var(--line)] focus-visible:ring-[var(--pine)]"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label
                htmlFor="login-email"
                className="text-[11px] sm:text-xs font-bold text-[var(--ink)]"
              >
                Email
              </Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="Email"
                disabled={isLoading}
                className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2.5 sm:px-3 bg-[var(--cream)]/60 border-[var(--line)] focus-visible:ring-[var(--pine)]"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="login-pass"
                className="text-[11px] sm:text-xs font-bold text-[var(--ink)]"
              >
                Password
              </Label>
              <Input
                id="login-pass"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2.5 sm:px-3 bg-[var(--cream)]/60 border-[var(--line)] focus-visible:ring-[var(--pine)]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-8.5 sm:h-9.5 md:h-10 bg-[var(--ink)] hover:bg-[var(--coral)] text-[var(--paper)] font-extrabold text-[11px] sm:text-xs tracking-wider transition-colors cursor-pointer mt-1"
            >
              {isLoading
                ? isRegistering
                  ? "Creating Account..."
                  : "Signing In..."
                : isRegistering
                  ? "Create Hiker Account →"
                  : "Sign In as Hiker →"}
            </Button>

            {onRegister && (
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] sm:text-xs font-semibold text-[var(--pine)] hover:underline cursor-pointer"
                >
                  {isRegistering
                    ? "Already have an account? Sign In"
                    : "Need an account? Register"}
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  if (mode !== "edit") onContinueAsGuest(initialName);
                  onClose?.();
                }}
                className="text-[11px] sm:text-xs text-[#748078] hover:text-[var(--ink)] transition-colors hover:underline underline-offset-2 cursor-pointer"
              >
                {mode === "edit" ? "back to hike" : "continue as guest"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
