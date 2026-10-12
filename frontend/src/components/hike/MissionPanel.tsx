import { useEffect, useId, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useReducedMotion } from "motion/react";
import { ListTodo, GripHorizontal, Plus, Pencil, Trash2, Minus } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import {
  calculateMissionProgress,
  continueTaskBullet,
  parseTaskText,
  MAX_TASKS,
  MAX_TASK_LENGTH,
  type TrailMissionCheckpoint,
} from "@/lib/trailMission";

const PANEL_SPRING = { type: "spring", stiffness: 260, damping: 22 } as const;

type MissionPanelProps = {
  checkpoints: TrailMissionCheckpoint[];
  onAddCheckpoint: (title: string) => void;
  onToggleCheckpoint: (id: string) => void;
  onRemoveCheckpoint: (id: string) => void;
  onEditCheckpoint: (id: string, title: string) => void;
  isReady: boolean;
  isGuest: boolean;
  saveStatus: string;
  onRetrySave: () => void;
};

function handleBulletEnter(event: KeyboardEvent<HTMLTextAreaElement>, onChange: (value: string) => void) {
  if (event.key !== "Enter" || event.nativeEvent.isComposing || event.shiftKey) return;
  const input = event.currentTarget;
  const next = continueTaskBullet(input.value, input.selectionStart, input.selectionEnd);
  if (!next) return;
  event.preventDefault();
  if (next.value.length > MAX_TASK_LENGTH) return;
  flushSync(() => onChange(next.value));
  input.setSelectionRange(next.caret, next.caret);
}

function handleTaskChange(event: ChangeEvent<HTMLTextAreaElement>, onChange: (value: string) => void) {
  const input = event.currentTarget;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const formatted = input.value.replace(/^([ \t]*)- /gm, "$1• ");
  if (formatted !== input.value) {
    flushSync(() => onChange(formatted));
    input.setSelectionRange(start, end);
  } else onChange(formatted);
}

function TaskText({ text }: { text: string }) {
  return parseTaskText(text).map((block, index) => block.type === "list" ? (
    <ul key={index} className="mt-1 list-disc space-y-1 pl-4">
      {block.lines.map((line, lineIndex) => <li key={lineIndex}>{line}</li>)}
    </ul>
  ) : <p key={index} className="whitespace-pre-wrap">{block.lines.join("\n")}</p>);
}

export function MissionPanel({
  checkpoints,
  onAddCheckpoint,
  onToggleCheckpoint,
  onRemoveCheckpoint,
  onEditCheckpoint,
  isReady,
  isGuest,
  saveStatus,
  onRetrySave,
}: MissionPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFloatingOnMobile, setIsFloatingOnMobile] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState({ top: 88, left: 16, right: 16, width: 340, side: "right" });
  const reduceMotion = useReducedMotion();
  const bodyId = useId();
  const widgetRef = useRef<HTMLButtonElement>(null);
  const widgetDragged = useRef(false);
  const minimizeRef = useRef<HTMLButtonElement>(null);
  const [newCheckpointTitle, setNewCheckpointTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const atLimit = checkpoints.length >= MAX_TASKS;
  const progress = calculateMissionProgress(checkpoints);
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLElement>(null);
  const [dockedSide, setDockedSide] = useState<"left" | "right">("right");
  const [snapSide, setSnapSide] = useState<"left" | "right" | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const widgetX = useMotionValue(0);
  const widgetY = useMotionValue(0);

  useEffect(() => {
    const resetPosition = () => {
      dragControls.cancel();
      x.stop();
      y.stop();
      x.set(
        dockedSide === "left"
          ? (panelRef.current?.offsetWidth || 340) + 32 - window.innerWidth
          : 0,
      );
      y.set(0);
      widgetX.set(0);
      widgetY.set(0);
      setIsFloatingOnMobile(false);
      setSnapSide(null);
    };
    window.addEventListener("resize", resetPosition);
    return () => window.removeEventListener("resize", resetPosition);
  }, [dockedSide, dragControls, x, y, widgetX, widgetY]);

  useEffect(() => {
    if (isMinimized) return;
    const panel = panelRef.current;
    if (!panel) return;
    const observer = new ResizeObserver(() => {
      if (window.innerWidth < 768) return;
      const bounds = panel.getBoundingClientRect();
      const overflow = Math.max(0, bounds.bottom + 8 - window.innerHeight);
      if (overflow) {
        y.stop();
        y.set(window.innerHeight - panel.offsetHeight - 8 - panel.offsetTop);
      }
    });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [isMinimized, y]);

  const dockPanel = (side: "left" | "right") => {
    const panel = panelRef.current;
    if (!panel) return;
    const target =
      side === "left" ? 16 : window.innerWidth - panel.offsetWidth - 16;
    animate(x, target - panel.offsetLeft, PANEL_SPRING);
    setDockedSide(side);
  };

  const nearbySide = () => {
    const bounds = panelRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    if (Math.abs(bounds.left - 16) <= 64) return "left";
    if (Math.abs(window.innerWidth - 16 - bounds.right) <= 64) return "right";
    return null;
  };

  const movePanel = (nextX: number, nextY: number) => {
    const panel = panelRef.current;
    if (!panel) return;
    const left = panel.offsetLeft;
    const top = panel.offsetTop;
    x.set(
      Math.min(
        window.innerWidth - panel.offsetWidth - 8 - left,
        Math.max(8 - left, nextX),
      ),
    );
    animate(
      y,
      Math.min(
        window.innerHeight - panel.offsetHeight - 8 - top,
        Math.max(8 - top, nextY),
      ),
      PANEL_SPRING,
    );
  };

  return (
    <div ref={constraintsRef} className="mission-drag-area" data-minimized={isMinimized}>
      <AnimatePresence initial={false}>
        {isMinimized && (
          <motion.button
            key="widget"
            ref={widgetRef}
            type="button"
            drag
            dragConstraints={constraintsRef}
            dragElastic={0}
            dragMomentum={false}
            style={{
              x: widgetX, y: widgetY, top: widgetPosition.top,
              left: widgetPosition.side === "left" ? widgetPosition.left : "auto",
              right: widgetPosition.side === "right" ? widgetPosition.right : "auto",
              transformOrigin: `top ${widgetPosition.side}`,
            }}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onPointerDown={() => { widgetDragged.current = false; }}
            onKeyDown={() => { widgetDragged.current = false; }}
            onDragStart={() => { widgetDragged.current = true; }}
            onTap={() => {
              if (widgetDragged.current) return;
              const bounds = widgetRef.current?.getBoundingClientRect();
              const panel = panelRef.current;
              if (bounds && panel) {
                const side = bounds.left + bounds.width / 2 < window.innerWidth / 2 ? "left" : "right";
                const left = Math.max(8, Math.min(
                  side === "left" ? bounds.left : bounds.right - panel.offsetWidth,
                  window.innerWidth - panel.offsetWidth - 8,
                ));
                const top = Math.max(8, Math.min(bounds.top, window.innerHeight - panel.offsetHeight - 8));
                x.stop();
                y.stop();
                x.set(left - panel.offsetLeft);
                y.set(top - panel.offsetTop);
                setDockedSide(side);
                setWidgetPosition((position) => ({ ...position, left, top, side }));
                if (isMobile) setIsFloatingOnMobile(true);
              }
              flushSync(() => setIsMinimized(false));
              minimizeRef.current?.focus();
            }}
            aria-label="Expand task panel"
            title="Drag to move. Click to open tasks."
            aria-expanded={false}
            aria-controls={bodyId}
            data-side={dockedSide}
            className="mission-task-widget flex h-12 touch-none select-none items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--cream)] px-4 text-[var(--ink)] shadow-xl cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#0aa256]"
          >
            <ListTodo className="size-4 text-[var(--pine)]" />
            <span className="text-sm font-bold">Tasks</span>
            <span className="text-xs text-[var(--pine)]">{progress.completed}/{progress.total}</span>
          </motion.button>
        )}
      </AnimatePresence>
      {snapSide && !isMobile && !isMinimized && (
        <div
          className="mission-dock-preview"
          data-side={snapSide}
          aria-hidden="true"
        />
      )}
      <motion.aside
        ref={panelRef}
        drag={!isMobile}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragTransition={{
          power: 0.15,
          timeConstant: 200,
          bounceStiffness: 260,
          bounceDamping: 22,
        }}
        onDrag={() => setSnapSide(nearbySide())}
        onDragEnd={() => {
          const side = nearbySide();
          setSnapSide(null);
          if (side) dockPanel(side);
        }}
        style={{
          x: isMobile ? 0 : x, y: isMobile ? 0 : y,
          transformOrigin: `top ${widgetPosition.side}`,
          ...(isMobile && (isMinimized || isFloatingOnMobile) && {
            position: "fixed", top: widgetPosition.top, left: widgetPosition.left,
            width: widgetPosition.width, maxWidth: "calc(100vw - 16px)",
            maxHeight: "calc(100dvh - 16px)", zIndex: 40,
          }),
        }}
        animate={{ opacity: isMinimized ? 0 : 1, scale: isMinimized && !reduceMotion ? 0.96 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        data-side={dockedSide}
        data-minimized={isMinimized}
        aria-hidden={isMinimized}
        inert={isMinimized}
        className="mission-panel select-none rounded-2xl border border-[var(--line)] bg-[var(--cream)] px-3 pb-3 pt-1 text-[var(--ink)] shadow-xl backdrop-blur-md"
        aria-label="Task manager"
      >
        <div className="mb-1 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center">
          <button
            type="button"
            aria-label="Move task panel"
            title="Drag near an edge to dock. Arrow keys move; Escape resets."
            className="col-start-2 hidden size-8 items-center justify-center touch-none select-none rounded text-[var(--pine)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pine)] md:flex cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              if (e.button === 0) dragControls.start(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                dockPanel("right");
                animate(y, 0, PANEL_SPRING);
              }
              if (
                !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  e.key,
                )
              )
                return;
              e.preventDefault();
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                dockPanel(e.key === "ArrowLeft" ? "left" : "right");
                return;
              }
              movePanel(
                x.get(),
                y.get() +
                  (e.key === "ArrowUp" ? -16 : e.key === "ArrowDown" ? 16 : 0),
              );
            }}
          >
            <GripHorizontal className="size-4" />
          </button>
          <button
            ref={minimizeRef}
            type="button"
            onClick={() => {
              const bounds = panelRef.current?.getBoundingClientRect();
              if (bounds) setWidgetPosition({
                top: Math.max(8, Math.min(bounds.top, window.innerHeight - 56)),
                left: Math.max(8, bounds.left),
                right: Math.max(8, window.innerWidth - bounds.right),
                width: bounds.width,
                side: bounds.left + bounds.width / 2 < window.innerWidth / 2 ? "left" : "right",
              });
              widgetX.set(0);
              widgetY.set(0);
              flushSync(() => setIsMinimized(true));
              widgetRef.current?.focus();
            }}
            aria-label="Minimize task panel"
            title="Minimize task panel"
            aria-expanded={true}
            aria-controls={bodyId}
            className="col-start-3 flex size-11 items-center justify-center justify-self-end rounded-lg text-[var(--pine)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0aa256] md:size-8"
          >
            <Minus className="size-4" />
          </button>
        </div>
        <header className="flex shrink-0 items-center gap-2 border-b border-[var(--line)] pb-3">
          <ListTodo className="size-4 shrink-0 text-[var(--pine)]" />
          <h2 className="text-sm font-bold">Tasks</h2>
          <span
            className="ml-auto shrink-0 text-xs text-[var(--pine)]"
            role="status"
          >
            {progress.completed}/{progress.total} done
          </span>
        </header>

        <div id={bodyId} className="mission-panel-body flex min-h-0 flex-1 flex-col">
          {(!isGuest || saveStatus !== "saved") && (
            <div className="mt-2 flex shrink-0 items-center justify-between gap-2 text-[11px] text-[var(--pine)]">
              <span role="status">
                {saveStatus === "loading" ? "Loading tasks…" :
                  saveStatus === "saving" || saveStatus === "pending" ? "Saving…" :
                  saveStatus === "error" ? (isReady ? "Couldn’t save tasks." : "Couldn’t load tasks.") :
                  "Saved to your account"}
              </span>
              {saveStatus === "error" && (
                <button type="button" onClick={onRetrySave} className="rounded px-2 py-1 font-semibold underline focus-visible:outline-2 focus-visible:outline-[#0aa256]">Retry</button>
            )}
          </div>
          )}
          <fieldset disabled={!isReady} className="flex min-h-0 min-w-0 flex-1 flex-col disabled:opacity-60">
            <div
              className="mission-checkpoints mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1"
              aria-label="Tasks"
            >
              {checkpoints.length === 0 && (
                <p className="text-xs text-[var(--pine)]">
                  No tasks yet. Add your first task below.
                </p>
              )}
              {checkpoints.map((checkpoint) => (
                <div
                  key={checkpoint.id}
                  className="flex shrink-0 items-start gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-2"
                >
                  {editingId === checkpoint.id ? (
                    <form className="min-w-0 flex-1" onSubmit={(event) => {
                      event.preventDefault();
                      if (!editTitle.trim()) return;
                      onEditCheckpoint(checkpoint.id, editTitle);
                      setEditingId(null);
                    }}>
                      <label htmlFor={`edit-${checkpoint.id}`} className="text-xs font-semibold">Edit task</label>
                      <textarea
                        id={`edit-${checkpoint.id}`}
                        autoFocus
                        rows={4}
                        maxLength={MAX_TASK_LENGTH}
                        value={editTitle}
                        onChange={(event) => handleTaskChange(event, setEditTitle)}
                        onKeyDown={(event) => handleBulletEnter(event, setEditTitle)}
                        className="mt-1 w-full resize-y select-text rounded-lg border border-[var(--line)] bg-[var(--cream)] p-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#0aa256]"
                      />
                      <div className="mt-2 flex gap-2">
                        <button type="submit" disabled={!editTitle.trim()} className="rounded-lg bg-[var(--pine)] px-3 py-2 text-xs font-semibold text-[var(--paper)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0aa256]">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="rounded-lg px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-[#0aa256]">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        aria-label={`Complete task: ${checkpoint.title.split("\n")[0]}`}
                        checked={checkpoint.completed}
                        onChange={() => onToggleCheckpoint(checkpoint.id)}
                        className="mt-0.5 size-4 shrink-0 accent-[#0aa256] focus-visible:outline-2 focus-visible:outline-[#0aa256]"
                      />
                      <div
                        className={cn(
                          "min-w-0 flex-1 py-0.5 text-xs [overflow-wrap:anywhere]",
                          checkpoint.completed && "text-[var(--pine)] line-through",
                        )}
                      >
                        <TaskText text={checkpoint.title} />
                      </div>
                    </>
                  )}
                  <div className="flex shrink-0 items-center">
                    {editingId !== checkpoint.id && (
                      <button
                        type="button"
                        onClick={() => { setEditingId(checkpoint.id); setEditTitle(checkpoint.title); }}
                        aria-label={`Edit task: ${checkpoint.title.split("\n")[0]}`}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded text-[var(--pine)] focus-visible:outline-2 focus-visible:outline-[#0aa256] md:size-6"
                      >
                        <Pencil className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveCheckpoint(checkpoint.id)}
                      aria-label={`Delete task: ${checkpoint.title.split("\n")[0]}`}
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded text-[var(--pine)] hover:text-[#e74c3c] focus-visible:outline-2 focus-visible:outline-[#0aa256] md:size-6"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form
              className="mt-3 shrink-0"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCheckpointTitle.trim() || atLimit) return;
                onAddCheckpoint(newCheckpointTitle.trim());
                setNewCheckpointTitle("");
              }}
            >
              <label
                htmlFor="new-checkpoint"
                className="block text-xs font-semibold text-[var(--pine)]"
              >
                New task
              </label>
              <div className="mt-1 p-1 flex flex-col gap-2">
                <textarea
                  id="new-checkpoint"
                  rows={3}
                  value={newCheckpointTitle}
                  onChange={(event) => handleTaskChange(event, setNewCheckpointTitle)}
                  onKeyDown={(event) => handleBulletEnter(event, setNewCheckpointTitle)}
                  placeholder={"Review for math exam\n- Calculus Module 1–3\n- Algebra"}
                  maxLength={MAX_TASK_LENGTH}
                  disabled={atLimit}
                  aria-describedby="task-input-help"
                  className="w-full min-w-0 resize-none select-text rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#0aa256] disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={!newCheckpointTitle.trim() || atLimit}
                  className="flex min-h-10 items-center justify-center gap-1 rounded-xl bg-[var(--pine)] text-[var(--paper)] px-3 text-xs font-bold hover:bg-[var(--ink)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#0aa256]"
                >
                  <Plus className="size-3.5" /> Add
                </button>
              </div>
              <p id="task-input-help" className="mt-1 text-[11px] text-[var(--pine)]">
                {atLimit ? "20-task limit reached. Delete a task to add another." : `Type “- ” for bullets. ${checkpoints.length}/${MAX_TASKS} tasks.`}
              </p>
            </form>
          </fieldset>
        </div>
      </motion.aside>
    </div>
  );
}
