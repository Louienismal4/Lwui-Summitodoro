import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { TopPerimeterBar } from "@/components/hike/TopPerimeterBar";
import {
  MountainMap,
  type MountainMapHandle,
} from "@/components/map/MountainMap";
import { Mountain, Tent } from "lucide-react";
import { TrailFallback } from "@/components/map/TrailFallback";
import { ProfileOnboardingDialog } from "@/components/profile/ProfileOnboardingDialog";
import { HikerSettingsDialog } from "@/components/profile/HikerSettingsDialog";
import { CornerProfileDial } from "@/components/profile/CornerProfileDial";
import {
  EXPEDITION_MOUNTAINS,
  type ExpeditionMountain,
} from "@/data/expeditionMountains";
import { prepareTrail, getCoordinateAtProgress } from "@/lib/trailEngine";
import { useHikerProfile } from "@/hooks/useHikerProfile";
import { useFocusSession } from "@/hooks/useFocusSession";
import { useTrailMission } from "@/hooks/useTrailMission";
import { getAuthToken } from "@/services/api";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  getCameraOffsetPadding,
  getMobileCameraOffsetPadding,
} from "@/lib/cameraOffset";
import { MissionPanel } from "@/components/hike/MissionPanel";
import { StartHikeDialog } from "@/components/hike/StartHikeDialog";
import { Button } from "@/components/ui/button";

import { OnTrailFocusColumn } from "@/components/hike/OnTrailFocusColumn";
import { UltraThinCheckpointLine } from "@/components/hike/UltraThinCheckpointLine";
import { RestBreakPrompt } from "@/components/hike/RestBreakPrompt";
import { SummitCelebrationCard } from "@/components/hike/SummitCelebrationCard";
import { LogbookDialog } from "@/components/hike/LogbookDialog";
import { useLogbook } from "@/hooks/useLogbook";
import type { PreparedTrail, TrailFeature } from "@/types/trail";

export function HikePage() {
  const {
    profile,
    isLoading: isProfileLoading,
    isGuest,
    onboardingComplete,
    login,
    register,
    logout,
    updateProfile,
    continueAsGuest,
  } = useHikerProfile();

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedMountain, setSelectedMountain] = useState<ExpeditionMountain>(
    () => EXPEDITION_MOUNTAINS[0],
  );

  const taskOwner = isProfileLoading ? undefined : isGuest ? null : getAuthToken();
  const {
    missionTitle,
    checkpoints: missionCheckpoints,
    addCheckpoint: addMissionCheckpoint,
    toggleCheckpoint: toggleMissionCheckpoint,
    removeCheckpoint: removeMissionCheckpoint,
    editCheckpoint: editMissionCheckpoint,
    isReady: areTasksReady,
    saveStatus: taskSaveStatus,
    retrySave: retryTaskSave,
  } = useTrailMission(taskOwner);

  const [geoJsonFeature, setGeoJsonFeature] = useState<TrailFeature | null>(
    null,
  );
  const [trailLoading, setTrailLoading] = useState(true);
  const [mapUnavailableReason, setMapUnavailableReason] = useState<
    string | null
  >(null);
  const [isFollowingHiker, setIsFollowingHiker] = useState(true);
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const { entries: logbookEntries, stats: logbookStats, recordSummit } =
    useLogbook();

  const completedMissionCount = useMemo(
    () => missionCheckpoints.filter((c) => c.completed).length,
    [missionCheckpoints],
  );

  const mapRef = useRef<MountainMapHandle>(null);

  const session = useFocusSession(0, {
    restStops: selectedMountain.checkpoints,
    summitContext: {
      mountain: selectedMountain,
      missionTitle: missionTitle || undefined,
      completedCheckpointsCount: completedMissionCount,
      totalCheckpointsCount: missionCheckpoints.length,
      isGuest,
    },
    onSummit: (outcome) => {
      recordSummit({
        mountainId: outcome.mountain.id,
        mountainName: outcome.mountain.name,
        trailName: outcome.mountain.trailName,
        province: outcome.mountain.province,
        elevation: outcome.mountain.elevationMasl,
        durationMinutes: outcome.durationMinutes,
        expEarned: outcome.rewards.exp,
        coinsEarned: outcome.rewards.coins,
        missionTitle: outcome.missionTitle,
        completedCheckpointsCount: outcome.completedCheckpointsCount,
        totalCheckpointsCount: outcome.totalCheckpointsCount,
        completedAt: outcome.completedAt,
      });
      updateProfile({
        exp: profile.exp + outcome.rewards.exp,
        coins: profile.coins + outcome.rewards.coins,
      });
    },
  });

  const isMobile = useIsMobile(768);
  const [isMobileSheetExpanded, setIsMobileSheetExpanded] = useState(false);
  const [isStartHikeOpen, setIsStartHikeOpen] = useState(false);

  const cameraPadding = useMemo(() => {
    if (isMobile) {
      return getMobileCameraOffsetPadding({
        isSessionActive:
          session.status === "running" || session.status === "paused",
        isSheetExpanded: isMobileSheetExpanded,
        isSheetVisible: false,
        viewportHeight:
          typeof window !== "undefined" ? window.innerHeight : 800,
      });
    }
    if (session.status === "idle") {
      return { top: 0 };
    }
    return getCameraOffsetPadding();
  }, [isMobile, isMobileSheetExpanded, session.status]);

  const handleDeploy = useCallback(() => {
    setIsStartHikeOpen(false);
    setIsMobileSheetExpanded(false);
    session.start();
  }, [session]);

  const handleAbandon = useCallback(() => {
    setIsStartHikeOpen(false);
    setIsMobileSheetExpanded(false);
    session.reset();
  }, [session]);

  const handleReturnToCamp = useCallback(() => {
    setIsStartHikeOpen(false);
    setIsMobileSheetExpanded(false);
    session.reset();
  }, [session]);


  const handleSelectMountain = useCallback(
    (mountain: ExpeditionMountain) => {
      if (session.status !== "idle") return;
      setSelectedMountain(mountain);
      setTrailLoading(true);
      setMapUnavailableReason(null);
    },
    [session],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setIsProfileDialogOpen(false);
  }, [logout]);

  // Load trail GeoJSON asset when mountain changes
  useEffect(() => {
    let cancelled = false;

    fetch(selectedMountain.trailAssetUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Trail asset not found (${res.status})`);
        return res.json() as Promise<TrailFeature>;
      })
      .then((feature) => {
        if (!cancelled) {
          setGeoJsonFeature(feature);
          setTrailLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setGeoJsonFeature(null);
          setTrailLoading(false);
          setMapUnavailableReason(
            err instanceof Error ? err.message : "Trail data unavailable",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedMountain.trailAssetUrl]);

  // Derive prepared trail geometry
  const preparedTrail = useMemo<PreparedTrail | null>(() => {
    if (!geoJsonFeature) return null;
    try {
      return prepareTrail(geoJsonFeature);
    } catch {
      return null;
    }
  }, [geoJsonFeature]);

  // Compute live hiker coordinate along trail
  const currentCoordinate = useMemo(() => {
    if (!preparedTrail) return null;
    return getCoordinateAtProgress(preparedTrail, session.progress);
  }, [preparedTrail, session.progress]);

  // Compute map checkpoint items
  const mapCheckpoints = useMemo(() => {
    if (!preparedTrail) return [];
    return selectedMountain.checkpoints.map((cp) => ({
      id: cp.id,
      name: cp.name,
      coordinate: getCoordinateAtProgress(preparedTrail, cp.progress),
    }));
  }, [preparedTrail, selectedMountain.checkpoints]);

  // Reached checkpoint IDs based on session progress
  const reachedCheckpointIds = useMemo(() => {
    return selectedMountain.checkpoints
      .filter((cp) => session.progress >= cp.progress)
      .map((cp) => cp.id);
  }, [selectedMountain.checkpoints, session.progress]);

  // Next checkpoint
  const nextCheckpoint = useMemo(() => {
    return selectedMountain.checkpoints.find(
      (cp) => session.progress < cp.progress,
    );
  }, [selectedMountain.checkpoints, session.progress]);

  const handleMapUnavailable = useCallback((reason: string) => {
    setMapUnavailableReason(reason);
  }, []);

  if (isProfileLoading) {
    return (
      <main className="min-h-screen w-full bg-[#0f1712] flex items-center justify-center text-[#748078] text-sm">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-[#0aa256] animate-ping" />
          <span>Restoring expedition…</span>
        </div>
      </main>
    );
  }

  return (
    <main
      className={cn(
        "game-shell relative",
        !onboardingComplete &&
          "filter blur-md pointer-events-none select-none overflow-hidden",
      )}
      inert={!onboardingComplete ? true : undefined}
      aria-hidden={!onboardingComplete ? true : undefined}
    >
      {/* Non-interactive backdrop blocker when onboarding is active */}
      {!onboardingComplete && (
        <div
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px] pointer-events-auto cursor-not-allowed select-none"
          aria-hidden="true"
        />
      )}

      {/* Top Perimeter Bar */}
      <TopPerimeterBar
        selectedMountain={selectedMountain}
        onSelectMountain={handleSelectMountain}
        canSelectMountain={session.status === "idle"}
      />

      <div className="hike-layout">
        <MissionPanel
          key={taskOwner ?? (isProfileLoading ? 'loading' : 'guest')}
          checkpoints={missionCheckpoints}
          onAddCheckpoint={addMissionCheckpoint}
          onToggleCheckpoint={toggleMissionCheckpoint}
          onRemoveCheckpoint={removeMissionCheckpoint}
          onEditCheckpoint={editMissionCheckpoint}
          isReady={areTasksReady}
          saveStatus={taskSaveStatus}
          onRetrySave={retryTaskSave}
          isGuest={taskOwner === null}
        />
        <div className="hike-expedition">
          {/* Full-Bleed Map Canvas & HUD Overlays */}
          <section
            className="game-map absolute inset-0 w-full h-full "
            aria-label="Virtual expedition map"
          >
            {trailLoading && !mapUnavailableReason && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#e7eae5] text-[#475549] text-xs font-semibold gap-2 z-10">
                <span className="size-2 rounded-full bg-[#0aa256] animate-ping" />
                Loading expedition map…
              </div>
            )}

            {mapUnavailableReason ? (
              <TrailFallback
                mountain={selectedMountain}
                progress={session.progress}
                reason={mapUnavailableReason}
              />
            ) : (
              <MountainMap
                ref={mapRef}
                feature={preparedTrail?.feature}
                coordinate={currentCoordinate}
                progress={session.progress}
                mountainName={selectedMountain.name}
                checkpoints={mapCheckpoints}
                reachedCheckpointIds={reachedCheckpointIds}
                hikerAvatarUrl={profile.avatarUrl}
                cameraPadding={cameraPadding}
                onFollowChange={setIsFollowingHiker}
                onUnavailable={handleMapUnavailable}
              />
            )}

            {/* Top-Left: Map Status Ribbon (Desktop only to prevent colliding with mobile map controls) */}
            <div
              className={cn(
                "map-mission-card map-status-ribbon hidden md:grid md:mt-4 sm:mt-5",
                (session.status === "running" || session.status === "paused") &&
                  "hidden 2xl:grid",
              )}
            >
              <div className="ribbon-stat">
                <Mountain size={16} color="#287106" absoluteStrokeWidth />
                <div>
                  <strong>{selectedMountain.name}</strong>
                  <span className="text-[10px] text-[#717a73] font-medium block leading-tight">
                    {selectedMountain.trailName} · {selectedMountain.province}
                  </span>
                  <span className="ribbon-checkpoint">
                    <small>Next checkpoint</small>
                    <strong>{nextCheckpoint?.name ?? "Summit"}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Top-Right: Map Control Stack */}
            <div className="map-control-stack" aria-label="Map controls">
              <button
                type="button"
                className={isFollowingHiker ? "is-active" : undefined}
                onClick={() => mapRef.current?.followHiker()}
                title="Follow hiker"
                aria-label="Follow hiker"
                aria-pressed={isFollowingHiker}
              >
                <span>◎</span>
                <small>Follow</small>
              </button>
              <button
                type="button"
                onClick={() => mapRef.current?.resetCamera()}
                title="Reset camera"
                aria-label="Reset camera"
              >
                <span>↺</span>
                <small>Reset</small>
              </button>
              <button
                type="button"
                onClick={() => mapRef.current?.fitTrail()}
                title="Fit trail"
                aria-label="Fit trail"
              >
                <span>⌗</span>
                <small>Fit trail</small>
              </button>
            </div>

            {/* Ultra-Thin 4px Checkpoint Progress Line */}
            <UltraThinCheckpointLine
              checkpoints={selectedMountain.checkpoints}
              progress={session.progress}
              durationMinutes={session.durationMinutes}
              sessionStatus={session.status}
            />
          </section>

          {session.status === "idle" && (
            <StartHikeDialog
              open={isStartHikeOpen}
              onOpenChange={setIsStartHikeOpen}
              durationMinutes={session.durationMinutes}
              onSelectDuration={session.setDurationMinutes}
              onStart={handleDeploy}
            />
          )}

          {session.status === "idle" && (
            <Button
              type="button"
              onClick={() => setIsStartHikeOpen(true)}
              className="absolute bottom-6 left-1/2 z-20 h-12 -translate-x-1/2 gap-2 rounded-full px-6 text-sm font-semibold shadow-lg"
              aria-haspopup="dialog"
              aria-expanded={isStartHikeOpen}
            >
              <Tent className="size-4" aria-hidden="true" />
              <span>Start Hike</span>
            </Button>
          )}

          {/* On Trail Focus Column / Mobile Mini-Tracker (Running/Paused State) */}
          {(session.status === "running" || session.status === "paused") && (
            <OnTrailFocusColumn
              mountainName={selectedMountain.name}
              missionTitle={missionTitle}
              session={session}
              onAbandon={handleAbandon}
              onExpandChange={setIsMobileSheetExpanded}
            />
          )}


        </div>
      </div>

      {/* Summit Conquered Celebration Card Overlay (Summit State) */}
      {session.summitOutcome && (
        <SummitCelebrationCard
          {...session.summitOutcome}
          onReturnToCamp={handleReturnToCamp}
          onViewLogbook={() => setIsLogbookOpen(true)}
        />
      )}

      {/* Rest Break Prompt Dialog */}
      {session.activeRestStop && (
        <RestBreakPrompt
          key={session.activeRestStop.id}
          checkpoint={session.activeRestStop}
          onResume={session.resume}
        />
      )}

      {/* Corner Profile Dial (Bottom-Left HUD) */}
      <CornerProfileDial
        profile={profile}
        onOpenProfile={() => setIsProfileDialogOpen(true)}
      />

      {/* Hiker Logbook Journal Dialog */}
      <LogbookDialog
        open={isLogbookOpen}
        onOpenChange={setIsLogbookOpen}
        entries={logbookEntries}
        stats={logbookStats}
      />

      {/* 1. Onboarding Dialog Gate */}
      {!onboardingComplete && (
        <ProfileOnboardingDialog
          open={true}
          onOpenChange={() => {}}
          initialName={profile.displayName}
          mode="onboarding"
          onContinueAsGuest={continueAsGuest}
          onLogin={login}
          onRegister={register}
          onClose={() => {}}
        />
      )}

      {/* 2. Simple Hiker Profile & Settings Modal inside /hike */}
      {onboardingComplete && (
        <HikerSettingsDialog
          open={isProfileDialogOpen}
          onOpenChange={setIsProfileDialogOpen}
          profile={profile}
          isGuest={isGuest}
          onUpdateProfile={updateProfile}
          onLogin={login}
          onRegister={register}
          onLogout={handleLogout}
        />
      )}
    </main>
  );
}
